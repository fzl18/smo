import ENV from './env.js';

const STATIC = false;

let API_URL = {};

if (!STATIC) {
    API_URL = {
        enterprise:{
            listAllEnterprise:`${ENV.ADMIN_URL}/sysManager/listAllEnterprise.do`,
        },
        user: {
            getLoginUser: `${ENV.MANAGER_URL}/getUserInfo.do`,
            clearSession: `${ENV.MANAGER_URL}/clearSession.do`,
            modifyPassword:`${ENV.ADMIN_URL}/sysManager/modifyPassword.do`,
            queryEnterpriseUserList:`${ENV.ADMIN_URL}/entManager/queryEnterpriseUserList.do`,
        },
        common: {
            arealist: `${ENV.ADMIN_URL}/entManager/getRegionListByParentId.do`, // 获取省市接口（一级行政单位
        },
        investigation: {
            list: `${ENV.ADMIN_URL}/investigation/queryInvestigationList.do`,
            del: `${ENV.ADMIN_URL}/investigation/delete.do`,
            view: `${ENV.ADMIN_URL}/investigation/viewDetail.do`,
            create: `${ENV.ADMIN_URL}/entManager/addInvestigation.do`,
            update: `${ENV.ADMIN_URL}/investigation/updateInvestigation.do`,
            queryUserByKey: `${ENV.ADMIN_URL}/entManager/queryEnterpriseUserList.do`,
            updateStatus: `${ENV.ADMIN_URL}/investigation/updateStatus.do`,
            queryInvestigationSiteByKeyword: `${ENV.ADMIN_URL}/investigation/site/queryKeyword.do`,
        },
        hospital: {
            hospitalList: `${ENV.ADMIN_URL}/hospital/list.do`,
            create: `${ENV.ADMIN_URL}/entManager/addHospitalInEnterprise.do`,
            update: `${ENV.ADMIN_URL}/entManager/modifyHospitalRemark.do`,
            list: `${ENV.ADMIN_URL}/entManager/listHospitalsByEnterpriseId.do`,
            del: `${ENV.ADMIN_URL}/entManager/removeHospitalEnterprise.do`,
            listhospitals: `${ENV.ADMIN_URL}/entManager/listHospitals.do`,
            departmentlist: `${ENV.ADMIN_URL}/entManager/queryDepByHospitalEnterprise.do`,
            departmentadd: `${ENV.ADMIN_URL}/entManager/addHospitalDepInEnterpriseId.do`, // 添加医院科室
            departmentupdata: `${ENV.ADMIN_URL}/entManager/modifyHospitalDepInEnterpriseIdRemark.do`, // 修改医院科室备注
            departmentdel: `${ENV.ADMIN_URL}/entManager/removeHospitalDepInEnterprise.do`, // 移除医院科室
            addHospitalDepartmentUser: `${ENV.ADMIN_URL}/entManager/addHospitalDepartmentUser.do`, // 为医院科室配置管理医生的添加接口
            queryDoctorListByDepId: `${ENV.ADMIN_URL}/entManager/queryDoctorListByDepId.do`, // 为医院科室配置管理医生的查询接口
            removeDepIn: `${ENV.ADMIN_URL}/entManager/removeHospitalDepInEnterprise.do`, // 移除医院科室
            doctorlist: `${ENV.ADMIN_URL}/entManager/queryDoctorListByEntId.do`, // 医生列表
            querydepartment: `${ENV.ADMIN_URL}/entManager/queryDepWhenAddDoctor.do`, // 查询科室列表
            queryDepByHospitalEnterpriseByHospitalId: `${ENV.ADMIN_URL}/entManager/queryDepByHospitalEnterpriseByHospitalId.do`, // 查询科室列表
            addDoctor: `${ENV.ADMIN_URL}/entManager/addHospitalDepartmentDoctor.do`, // 添加部门下的医生
            editDoctor: `${ENV.ADMIN_URL}/entManager/modifyHospitalDepartmentDoctor.do`, // 修改部门下的医生
            delDoctor: `${ENV.ADMIN_URL}/entManager/removeHospitalDepartmentDoctor.do`, // 删除部门下的医生
        },
        customer: {
            create: `${ENV.ADMIN_URL}/entManager/addCustomer.do`,  // ok
            update: `${ENV.ADMIN_URL}/entManager/modifyCustomerInfo.do`, // ok
            list: `${ENV.ADMIN_URL}/entManager/queryCustomerListByEntId.do`, // ok
            del: `${ENV.ADMIN_URL}/entManager/removeCustomerByUserId.do`, // ok
        },
        team: {
            create: `${ENV.ADMIN_URL}/entManager/addHospitalInEnterprise.do`,
            update: `${ENV.ADMIN_URL}/entManager/modifyHospitalRemark.do`,
            list: `${ENV.ADMIN_URL}/entManager/listAllParties.do`, // 部门列表
            delcity: `${ENV.ADMIN_URL}/entManager/removeUserChargeCity.do`,
            listhospitals: `${ENV.ADMIN_URL}/entManager/listHospitals.do`,
            positionlist: `${ENV.ADMIN_URL}/entManager/listAllPosition.do`,
            userlist: `${ENV.ADMIN_URL}/entManager/queryEnterpriseUserList.do`,
            citylist: `${ENV.ADMIN_URL}/entManager/queryEnterpriseUserChargeCity.do`,
            queryPosition: `${ENV.ADMIN_URL}/entManager/queryPositionById.do`, // position单查接口
            RoleCodes: `${ENV.ADMIN_URL}/entManager/listAllRoles.do`, // 企业中所有角色
            saveSteRole: `${ENV.ADMIN_URL}/entManager/addPositionRole.do`, // 保存配置职位角色
            queryuser: `${ENV.ADMIN_URL}/entManager/queryEnterpriseUserById.do`, // 人员管理单查
            querymanager: `${ENV.ADMIN_URL}/entManager/queryEnterpriseUserList.do`, // 人员领导列表页
            editUser: `${ENV.ADMIN_URL}/entManager/moidfyEnterpriseUserById.do`, // 存员工人员信息
            addCity: `${ENV.ADMIN_URL}/entManager/addUserChargeCity.do`, // 添加人员分管城市
            editCity: `${ENV.ADMIN_URL}/entManager/modifyUserChargeCity.do`, // 修改分管城市列表
            queryUserPositionSelect: `${ENV.ADMIN_URL}/entManager/queryUserPositionSelect.do`, // 查职位
            queryUserDepartmentSelect: `${ENV.ADMIN_URL}/entManager/queryUserDepartmentSelect.do`, // 查部门
            
        },
        daily: {
            create: `${ENV.ADMIN_URL}/entManager/addWorkCategoryByEntId.do`, // 添加企业下工作大类
            update: `${ENV.ADMIN_URL}/entManager/modifyWorkCategory.do`, // 修改工作大类
            list: `${ENV.ADMIN_URL}/entManager/listAllWorkCategory.do`, // 根据条件查询企业下工作大类
            del: `${ENV.ADMIN_URL}/entManager/removeWorkCategory.do`, // 移除工作大类
            addarea: `${ENV.ADMIN_URL}/entManager/addEnterpriseAreRegion.do`, // 添加大区
            queryarealist: `${ENV.ADMIN_URL}/entManager/queryAreaRegionList.do`, // 大区列表页
            editarealist: `${ENV.ADMIN_URL}/entManager/modifyEnterpriseAreRegion.do`, // 修改大区
            delarea: `${ENV.ADMIN_URL}/entManager/removeAreaById.do`, // 移除大区
            view: `${ENV.ADMIN_URL}/entManager/queryEnterpriseWorkTypeByEntId.do`, // 工作小类列表页
            addworktype: `${ENV.ADMIN_URL}/entManager/addEnterpriseWorkType.do`, // 添加工作种类
            editworktype: `${ENV.ADMIN_URL}/entManager/modifyEnterpriseWorkType.do`, // 修改工作种类
            delworktype: `${ENV.ADMIN_URL}/entManager/removeWorkTypeById.do`, // 移除工作种类
            citylist: `${ENV.ADMIN_URL}/entManager/removeWorkTypeById.do`,
            RoleCodes: `${ENV.ADMIN_URL}/entManager/listAllRoleCodes.do`, // 角色code选项
        },
        role: {
            create: `${ENV.ADMIN_URL}/entManager/addHospitalInEnterprise.do`,
            update: `${ENV.ADMIN_URL}/entManager/modifyRoleEnterprise.do`,
            list: `${ENV.ADMIN_URL}/entManager/listAllRoles.do`,
            codelist: `${ENV.ADMIN_URL}/entManager/listAllRoleCodes.do`,
            // del:`${ENV.ADMIN_URL}/entManager/removeHospitalEnterprise.do`,
        },
        entmanager: {
            list: `${ENV.ADMIN_URL}/sysManager/listAllEnterprise.do`,
            view: `${ENV.ADMIN_URL}/sysManager/queryEnterpriseById.do`,
            add: `${ENV.ADMIN_URL}/sysManager/addEnterprise.do`, //添加企业
            addEnterpriseManagerUser: `${ENV.ADMIN_URL}/sysManager/addEnterpriseManagerUser.do`, //添加企业管理员用户
            changeEntManger: `${ENV.ADMIN_URL}/sysManager/changeEntManger.do`, //变更企业管理员
            configEntManager: `${ENV.ADMIN_URL}/sysManager/configEntManager.do`, //配置企业管理员
            queryUser: `${ENV.ADMIN_URL}/sysManager/queryEntManagerUserList.do`, //查询用户列表
            queryAllEnterpriseManager: `${ENV.ADMIN_URL}/sysManager/queryAllEntManagerUserList.do`, //查询系统管理员列表
            queryEnt: `${ENV.ADMIN_URL}/sysManager/queryAlternativeEnterprises.do`, //查询企业列表
            changeUserStatus: `${ENV.ADMIN_URL}/user/changeUserStatus.do`, //启用/停用某个用户
            changeEntStatus: `${ENV.ADMIN_URL}/sysManager/changeEntStatus.do`, //启用/停用某个企业
        },
    };
}

export { API_URL as default, STATIC };
