// returns the state of *all* features for current user
function fetchAllFeatures() {
// in reality, this would have been a `fetch` call:
// `fetch("/api/features/all")`
    return new Promise(resolve => {
        const sampleFeatures = {
            "extended-summary": true,
            "feedback-dialog": false
        };
        setTimeout(resolve, 100, sampleFeatures);
    });
}


async function getFeatureState(featureName){
    const allFeatures = await fetchAllFeatures();
    

    return new Promise( (resolve, reject) => {
        resolve(allFeatures[featureName])
    } )

}


   // src/feature-x/summary.js
getFeatureState("extended-summary")
.then(function(isEnabled) {
    if (isEnabled) {
        showExtendedSummary();
    } else {
        showBriefSummary();
    }
});
// src/feature-y/feedback-dialog.js
getFeatureState("feedback-dialog")
.then(function(isEnabled) {
    if (isEnabled) {
        makeFeedbackButtonVisible();
    }
});