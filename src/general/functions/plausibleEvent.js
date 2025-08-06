


export const trackCustomEvent = (eventName, props) => {
    if (window.plausible) {
      const options = {props:props};
      //console.log(options);
      window.plausible(eventName, options);
    }
  };