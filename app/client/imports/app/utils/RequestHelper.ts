export class RequestHelper {
    public static getPath(url:string):string {
        var pathAndQuery:string = url.split(Meteor.absoluteUrl())[1];
        var path:string = "/" + pathAndQuery.split("?")[0];
        return path;
    }
    
    public static getUrlParamString(url:string):string {
        var pathAndQuery:string = url.split(Meteor.absoluteUrl())[1];
        var urlParamString:string = pathAndQuery.split("?")[1];
        return urlParamString;
    }

    public static getUrlParams(url:string):any {
        var match;
        var pl = /\+/g;  // Regex for replacing addition symbol with a space
        var search = /([^&=]+)=?([^&]*)/g;
        var decode = function (s) {
            return decodeURIComponent(s.replace(pl, " "));
        };

        var query:Array<string> = url.split("?");
        var queryParams:string;
        if (query.length > 1) {
            queryParams = query[1];
        }

        var urlParams:any;
        if (queryParams) {
            urlParams = {};
            while (match = search.exec(queryParams)) {
                urlParams[decode(match[1])] = decode(match[2]);
            }
        }

        return urlParams;
    }
}