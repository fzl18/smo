/**
 * Created by casteloyee on 2017/7/21.
 */

export default class StringUtil {

    static isNull(str) {
        if (str == undefined){
            return true;
        }
        if (str == "") {
            return true;
        }
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        return re.test(str);
    }

    static trim(str) {
        return String(str).replace(/(^\s*)|(\s*$)/g, '');
    }

}
