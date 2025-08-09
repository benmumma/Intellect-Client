import React, { createContext, useState, useContext, useEffect, useReducer, useCallback } from 'react';
import { ii_supabase, setIISupabaseSession, clearIISupabaseSession } from '../../constants/supabaseClient';
import { read_ii_user, upsert_ii_user, create_ii_user_via_backend } from '../api/ii_users';
import { read_ii_subjects } from '../api/ii_subjects';
import { read_ii_audiences } from '../api/ii_audiences';
import { read_ii_user_posts_v2 } from '../api/ii_user_posts';
import inboxReducer from '../context/inboxReducer';
import initialState from '../context/initialState';
import { format_dow_schedule } from '../helpers/reception_days';
import useCentralizedAuth from '../../auth/useCentralizedAuth';
import { REACT_APP_USE_CENTRALIZED_AUTH } from '../../constants/constants';

const IntellectInboxContext = createContext();

export const useIntellectInbox = () => useContext(IntellectInboxContext);

export const IntellectInboxProvider = ({ children }) => {
    const [iiSession, setIISession] = useState(null);
    const [loadingSession, setLoadingSession] = useState(true);
    const [userLoaded, setUserLoaded] = useState(false);
    const [inboxState, dispatch] = useReducer(inboxReducer, initialState);
    const [userDataFetched, setUserDataFetched] = useState(false);
    const [userLessonsFetched, setUserLessonsFetched] = useState(false);
    const [chatMessages, setChatMessages] = useState({});
    const useCentralized = REACT_APP_USE_CENTRALIZED_AUTH;
    const { isAuthenticated: cAuthenticated, user: cUser, session: cSession, loading: cLoading, hasIntellectAccess } = useCentralizedAuth();

    
    // Initialize session
    useEffect(() => {
        if (useCentralized) {
            // Wait for centralized auth to finish loading to avoid premature reset
            if (cLoading) {
                setLoadingSession(true);
                return; // do nothing until centralized auth resolves
            }
            // Mirror centralized auth state into iiSession shape
            (async () => {
              if (cAuthenticated) {
                // Immediately reflect signed-in UI with minimal info
                dispatch({
                  type: 'UPDATE_STATE',
                  payload: {
                    userStatus: 'signed_in',
                    user_id: cUser?.id || null,
                    email_address: cUser?.email || null,
                  },
                });
                // Bridge centralized session into Supabase client
                if (cSession) {
                  await setIISupabaseSession(cSession);
                }
                // If centralized auth didn't provide user, try to get it from Supabase after setting session
                let finalUser = cUser;
                if (!finalUser && cSession) {
                  try {
                    const { data: { user: sUser } } = await ii_supabase.auth.getUser();
                    if (sUser) finalUser = sUser;
                  } catch (e) {
                    console.warn('Supabase getUser failed after setting session', e);
                  }
                }
                if (finalUser) {
                  setIISession({ user: { id: finalUser.id, email: finalUser.email } });
                  setUserLoaded(true);
                  // Immediately reflect signed-in UI while data loads
                  dispatch({
                    type: 'UPDATE_STATE',
                    payload: {
                      userStatus: 'signed_in',
                      user_id: finalUser.id,
                      email_address: finalUser.email,
                    },
                  });
                } else {
                  // Auth says authenticated but no user; keep UI signed-in and wait for next tick/user fetch
                  setIISession(null);
                  setUserLoaded(false);
                }
              } else {
                await clearIISupabaseSession();
                setIISession(null);
                setUserLoaded(false);
                dispatch({ type: 'RESET_STATE' });
              }
              setLoadingSession(false);
            })();
            return; // no Supabase auth listeners when centralized auth is on
        }

        let authListener;

        checkAuthStatus();

        const initSession = async () => {
            console.log('Trying to initiate a session');

            try {
                const { data: { session }, error } = await ii_supabase.auth.getSession();

                if (session) {
                    console.log('Session found:', session);
                    setIISession(session);
                    setUserLoaded(true);
                } else if (error) {
                    console.error('Error fetching session:', error);
                }
            } catch (error) {
                console.error('Unexpected error fetching session:', error);
            }

            setLoadingSession(false);
        };

        initSession();

        authListener = ii_supabase.auth.onAuthStateChange(async (_event, session) => {
            console.log('Auth state changed:', _event);
            if (_event === 'SIGNED_OUT') {
                console.log('User signed out');
                setIISession(null);
                setUserLoaded(false);
                setUserDataFetched(false);
                setUserLessonsFetched(false);
                dispatch({ type: 'RESET_STATE' });
            }
            if (_event === 'SIGNED_IN') {
                console.log('User signed in or token refreshed:', session);
                setIISession(session);
                setUserLoaded(true);
                // Trigger data fetch
                //setUserDataFetched(false);
                //setUserLessonsFetched(false);
                checkAuthStatus();
            }
        });

        return () => {
            if (authListener && authListener.data && authListener.data.subscription) {
                authListener.data.subscription.unsubscribe();
            }
        };
    }, [useCentralized, cAuthenticated, cUser, cSession, cLoading]);

    const fetchUserData = useCallback(async () => {
       // console.log('fetchUserData user data');
        //console.log(iiSession);
        //console.log(userLoaded);
        if (!iiSession || !userLoaded) return;
        
        try {
            //console.log('fetchUserData in try');
            let [userData, subjects, audiences] = await Promise.all([
                read_ii_user(iiSession.user.id),
                read_ii_subjects(),
                read_ii_audiences(),
            ]);

            // If this is the user's first visit, create a default ii_users row
            if (!userData || userData.length === 0) {
                const defaultUserRow = {
                    user_id: iiSession.user.id,
                    email_address: iiSession.user.email,
                    user_tier: hasIntellectAccess ? 'premium' : 'free',
                    has_set_password: false,
                    current_audience: 3,
                    current_subject: 123,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    reception_time: 7,
                    dow_schedule: format_dow_schedule([], null),
                    user_name: iiSession.user.email ? iiSession.user.email.split('@')[0] : 'Anonymous',
                };
                // Create via backend (service role) to avoid client-side RLS issues
                const { result } = await create_ii_user_via_backend(defaultUserRow);
                if (result === 'success') {
                    userData = await read_ii_user(iiSession.user.id);
                }
            }

            // Sync user_tier with centralized access (except for admin)
            if (useCentralized && userData && userData.length > 0) {
                try {
                    const currentTier = userData[0].user_tier;
                    const targetTier = currentTier === 'admin' ? 'admin' : (hasIntellectAccess ? 'premium' : 'free');
                    if (currentTier !== targetTier && currentTier !== 'admin') {
                        const upsertRes = await upsert_ii_user({ user_id: iiSession.user.id, user_tier: targetTier });
                        if (upsertRes?.result === 'success') {
                            userData[0].user_tier = targetTier;
                        }
                    }
                } catch (e) {
                    console.warn('Failed to sync user_tier with centralized access', e);
                }
            }

            let current_subject_object = {};
            let current_audience_object = {};

            if (subjects && audiences && userData.length > 0) {
                current_subject_object = subjects.find(subject => parseInt(subject.id) === parseInt(userData[0].current_subject));
                current_audience_object = audiences.find(audience => parseInt(audience.id) === parseInt(userData[0].current_audience));
            }

            const payload = userData.length > 0 ? {
                userStatus: 'signed_in',
                userSignedUp: true,
                user_id: userData[0].user_id,
                email_address: userData[0].email_address,
                has_set_password: userData[0].has_set_password,
                user_name: userData[0].user_name,
                current_topic: userData[0].current_topic,
                current_subject: userData[0].current_subject,
                user_tier: userData[0].user_tier,
                current_audience: userData[0].current_audience,
                timezone: userData[0].timezone,
                reception_time: userData[0].reception_time,
                subject_options: subjects,
                audience_options: audiences,
                dow_schedule: userData[0].dow_schedule,
                current_audience_object: current_audience_object,
                current_subject_object: current_subject_object,
                chat_messages: [],
                live_session_id: null,
                is_typing: false,
                core_lessons_paused: userData[0].core_lessons_paused,
                add_course_credits: userData[0].add_course_credits,
                add_course_slots: userData[0].add_course_slots,
            } : {
                userStatus: 'signed_in',
                userSignedUp: false,
                has_set_password: false,
                user_id: iiSession.user.id,
                email_address: iiSession.user.email,
                subject_options: subjects,
                dow_schedule: {},
                audience_options: audiences,
                chat_messages: [],
                live_session_id: null,
                is_typing: false,
            };

            dispatch({ type: 'UPDATE_STATE', payload });
            setUserLoaded(true);
            setUserDataFetched(true);
        } catch (error) {
            console.error("Failed to fetch data", error);
        }
    }, [iiSession, userLoaded, dispatch, hasIntellectAccess, useCentralized]);

    const fetchUserLessons = useCallback(async () => {
        //console.log('fetchUserLessons');
        if (!inboxState.user_id || inboxState.lesson_data.length > 0) return;

        try {
            //console.log('fetchUserLessons in try')
            const data = await read_ii_user_posts_v2({ user_id: inboxState.user_id });
            if (data.length > 0) {
                dispatch({ type: 'SET_LESSONS', payload: data });
                dispatch({ type: 'UPDATE_STATE', payload: { last_email: data[0].created_at } });
                console.log('User lessons fetched, update state and set userLessonsFetched to true');
                setUserLessonsFetched(true);
            }
        } catch (error) {
            console.error("Failed to fetch user lessons", error);
        }
    }, [inboxState.user_id, inboxState.lesson_data.length, dispatch]);

    const checkAuthStatus = useCallback(async () => {
        try {
            if (useCentralized) {
                if (cAuthenticated && (cUser || cSession)) {
                    // Bridge tokens first if present
                    if (cSession) {
                        await setIISupabaseSession(cSession);
                    }
                    // Flip UI immediately
                    dispatch({
                        type: 'UPDATE_STATE',
                        payload: {
                            userStatus: 'signed_in',
                            user_id: cUser?.id || null,
                            email_address: cUser?.email || null,
                        },
                    });

                    // Ensure we have a concrete user; try Supabase if centralized user missing
                    let finalUser = cUser || null;
                    if (!finalUser && cSession) {
                        try {
                            const { data: { user: sUser } } = await ii_supabase.auth.getUser();
                            if (sUser) finalUser = sUser;
                        } catch (e) {
                            console.warn('Supabase getUser failed in checkAuthStatus()', e);
                        }
                    }

                    if (finalUser) {
                        setIISession({ user: { id: finalUser.id, email: finalUser.email } });
                        setUserLoaded(true);
                        if (!userDataFetched) {
                            await fetchUserData();
                        }
                        if (!userLessonsFetched) {
                            await fetchUserLessons();
                        }
                    } else {
                        // Stay signed-in visually; we'll fetch user on next tick
                        setIISession(null);
                        setUserLoaded(false);
                    }
                } else {
                    await clearIISupabaseSession();
                    setIISession(null);
                    setUserLoaded(false);
                    dispatch({ type: 'RESET_STATE' });
                }
                setLoadingSession(false);
                return;
            }

            const { data: { session }, error } = await ii_supabase.auth.getSession();
            if (session) {
                setIISession(session);
                setUserLoaded(true);
                if (!userDataFetched) {
                    await fetchUserData();
                }
                if (!userLessonsFetched) {
                    await fetchUserLessons();
                }
            } else {
                setIISession(null);
                setUserLoaded(false);
                dispatch({ type: 'RESET_STATE' });
            }
            setLoadingSession(false);
        } catch (error) {
            console.error('Error checking auth status:', error);
            setLoadingSession(false);
        }
    }, [useCentralized, cAuthenticated, cUser, cSession, fetchUserData, fetchUserLessons, userDataFetched, userLessonsFetched]);


    useEffect(() => {
        //console.log('in fetching data useEffect')
        if (iiSession && userLoaded) {
            console.log('Fetching Data!')
            if (!userDataFetched) {
                console.log('Fetching user data');
                fetchUserData();
            }
            if (!userLessonsFetched) {
                console.log('Fetching user lessons');
                fetchUserLessons();
            }
        }
    }, [iiSession, userLoaded, userDataFetched, userLessonsFetched, fetchUserData, fetchUserLessons]);

    // Keep user_tier in sync with centralized access changes after initial load
    useEffect(() => {
        if (!useCentralized) return;
        if (!iiSession || !userLoaded) return;
        // Determine desired tier from centralized access
        const desiredTier = (inboxState.user_tier === 'admin') ? 'admin' : (hasIntellectAccess ? 'premium' : 'free');
        if (inboxState.user_tier && inboxState.user_tier !== desiredTier && inboxState.user_tier !== 'admin') {
            (async () => {
                try {
                    const upsertRes = await upsert_ii_user({ user_id: iiSession.user.id, user_tier: desiredTier });
                    if (upsertRes?.result === 'success') {
                        dispatch({ type: 'UPDATE_STATE', payload: { user_tier: desiredTier } });
                    }
                } catch (e) {
                    console.warn('Failed to sync user_tier on access change', e);
                }
            })();
        }
    }, [useCentralized, hasIntellectAccess, iiSession, userLoaded, inboxState.user_tier, dispatch]);

    return (
        <IntellectInboxContext.Provider value={{ iiSession, loadingSession, userLoaded, inboxState, dispatch, checkAuthStatus }}>
            {children}
        </IntellectInboxContext.Provider>
    );
};