// To configur service URL and msg for global uses.

export const api = Object.freeze({
    base: 'https://limitless-crag-79759.herokuapp.com/',
    homefeed: "homefeed",
});

export var msg = {
    noResult: "No result found",
    wait: "Please wait searching...",
    svcFailedMsg:"",
    svcFailed: {
        timeOut: "Server is not responding. Please try after some time.",
        fail: "Service is not   Responding. please try after some time.",
        parserError: "Currently Server is not responding. Please try after some time. <br /><br />Error Code: X0012.",
        notFound: "Currently Server is not responding. Please try after some time. <br /><br />Error Code: X0013.",
        abort: "Currently Server is not responding. Please try after some time. <br /><br />Error Code: X0014.",
        error: "Currently Server is not responding. Please try after some time. <br /><br />Error Code: X0015. <div class='loaderIcon' style='float:right;'></div>",
        internalServerError: "Currently Server is not responding. Please try after some time. <br /><br />Error Code: X0016.",
        badRequest: "Currently Server is not responding. Please try after some time. <br /><br />Error Code: X0017.",
        other: "Service is not able to fetch data."
    }
};


