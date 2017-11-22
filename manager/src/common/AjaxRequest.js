/**
 * Created by casteloyee on 2017/7/27.
 */
import $ from './XDomainJquery';
import React from 'react';
import {Modal} from 'antd';
import StringUtil from './StringUtil';

export default class AjaxRequest {

    static sendRequest(options) {
        const datas = {};
        if (sessionStorage.curEnterpriseId && sessionStorage.curEnterpriseId > 0){
            datas.curEnterpriseId = sessionStorage.curEnterpriseId;
        }
        if (sessionStorage.userId && sessionStorage.userId > 0){
            datas.curUserId = sessionStorage.userId;
        }
        if (!StringUtil.isNull(sessionStorage.roleCode)){
            datas.curRoleCode = sessionStorage.roleCode;
        }
        let method = options.method;
        if (window.XDomainRequest) {
            method = "get";
          }
        $.ajax({
            method: method,
            url: options.url,
            data: {
                ...options.data,
                ...datas,
            },
            type: options.type,
        }).done(result => {
            if (result.error) {
                if((options.showError && option.showError == 1) || !options.showError){
                    //message.error(result.error);
                    Modal.error({title: result.error});
                }
                if (options.errorResult){
                    options.errorResult(result.error);
                }
            } else if (result.data && result.data.error) {
                if((options.showError && option.showError == 1) || !options.showError){
                    Modal.error({title: result.data.error});
                }
                if (options.errorResult) {
                    options.errorResult(result.data.error);
                }
            } else {
                options.doneResult(result);
            }
        });
    }
}
