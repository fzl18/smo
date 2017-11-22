import $ from 'jquery';
import API_URL from '../common/url';

const authStrategies = {
    role(options) {
        let role = sessionStorage && sessionStorage.length > 0 ? sessionStorage.roleCode : '';
        let userId = sessionStorage && sessionStorage.length > 0 ? sessionStorage.userId : 0;
        if (userId == 0){
            $.ajax({
                method: 'get',
                url: `${API_URL.user.getLoginUser}`,
                data: {},
                async: false,
                type: 'json',
            }).done(data => {
                if (!data.error) {
                    sessionStorage.userId = data.userId;
                    sessionStorage.userName = data.userName;
                    sessionStorage.roleCode = data.role;
                    sessionStorage.curEnterpriseId = data.enterpriseId;
                    sessionStorage.logOutUrl = data.logOutUrl;
                    role = data.role;
                } else {
                    console.error(data.error);
                }
            });
            // TODO：此处代码调试使用，非调试状态采用上面的ajax获取数据
            //sessionStorage.userId = 8968;
            //sessionStorage.userName = '金石企管';
            //sessionStorage.roleCode = 'EA';
            //sessionStorage.curEnterpriseId = 40;
            //role = 'EA';
        }
        if (options.includes(role)) {
            return com => com;
        }
        return com => '';
    },
    permission(options) {
        let show = false;
        const permissions = JSON.parse(sessionStorage.getItem('permission'));
        for (let i = 0; i < permissions.length; i++) {
            const permission = permissions[i].name;
            if (options.includes(permission)) {
                show = true;
                break;
            }
        }
        return com => show ? com : '';
    },
};

const auth = function (key, options) {
    return authStrategies[key](options);
};

export default auth;

export function auth2 (options) {
    return true;
};


// 验证权限
// auth('permission', ['模板:添加,修改,删除', '权限:/permission/list'])(component)
