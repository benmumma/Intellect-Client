
const getAudience = ({current_audience, audience_options}) => {
    //console.log(audience_options);
    if (!Array.isArray(audience_options) || !current_audience) {
        return null;
    }
    return audience_options.find(audience => audience.id === current_audience);
}
const getSubject = ({current_subject, subject_options}) => {
    //Search through the array of subject options and return the subject that matches the current subject
    //console.log(subject_options)
    if (!Array.isArray(subject_options) || !current_subject) {
        return null;
    }
    return subject_options.find(subject => subject.id === current_subject);

}


export { getAudience, getSubject};