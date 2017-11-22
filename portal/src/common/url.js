import ENV from './env.js';

const STATIC = false;

let API_URL = {};

if (!STATIC) {
    API_URL = {
        // SMO_PORTAL_URL: ENV.PORTAL_URL,
        config:{
            userIsSendEmail: `${ENV.ADMIN_URL}/userInfo/setMailFlag.do`,
            queryUserEmail: `${ENV.ADMIN_URL}/userInfo/getMailFlag.do`,
            logoutUrl: `${ENV.LOGOUT_URL}`,
        },
        home:{
            queryManHourMyWorkByDate: `${ENV.ADMIN_URL}/manHour/queryManHourMyWorkByDate.do`,
            queryManHourMyWorkByWeek: `${ENV.ADMIN_URL}/manHour/queryManHourMyWorkByWeek.do`,
            queryManHourMyWorkByMonth: `${ENV.ADMIN_URL}/manHour/queryManHourMyWorkByMonth.do`,
            queryAllInves: `${ENV.ADMIN_URL}/manHour/queryAllInves.do`,
            createEventRemind: `${ENV.ADMIN_URL}/event/createEventRemind.do`, //新增事件
            myProjectStatisticsByDate: `${ENV.ADMIN_URL}/investigationSummary/myProjectStatisticsByDate.do`, //我的项目 日
            myProjectStatisticsByWeek: `${ENV.ADMIN_URL}/investigationSummary/myProjectStatisticsByWeek.do`, //我的项目 周
            myProjectStatisticsByMonth: `${ENV.ADMIN_URL}/investigationSummary/myProjectStatisticsByMonth.do`, //我的项目 月
            acquiesceInStaffRate: `${ENV.ADMIN_URL}/investigationSummary/acquiesceInStaffRate.do`, // 人员效率
            queryUserRoleInvesPm:`${ENV.ADMIN_URL}/event/queryUserRoleInvesPm.do`,//查看是否是PM
            queryEventRemindList:`${ENV.ADMIN_URL}/event/queryEventRemindList.do`,//查看时间
            deleteEventRemind:`${ENV.ADMIN_URL}/event/deleteEventRemind.do`,
            queryTodayNotice: `${ENV.ADMIN_URL}/event/queryTodayNotice.do`, // 通知
            queryTodayNoticeAll: `${ENV.ADMIN_URL}/event/queryTodayNoticeAll.do`, // 所有通知
            queryEventRemindById: `${ENV.ADMIN_URL}/event/queryEventRemindById.do`, // 显示一个
            queryTodayNoticeByType: `${ENV.ADMIN_URL}/event/queryTodayNoticeByType.do`, //
            modifyEventRemind:`${ENV.ADMIN_URL}/event/modifyEventRemind.do`, //修改事件
            // getRegionTree:`${ENV.ADMIN_URL}/efficiency/getRegionTree.do`, //取区域
            queryAreaProduct:`${ENV.ADMIN_URL}/efficiency/queryAreaProduct.do`, //
            confirmNoticeRead:`${ENV.ADMIN_URL}/event/confirmNoticeRead.do`,
            emptyAllNoticeByUserId:`${ENV.ADMIN_URL}/event/emptyAllNoticeByUserId.do`,
            queryAllSignByMonth:`${ENV.ADMIN_URL}/event/queryAllSignByMonth.do`

        },
        user: {
            getUserDetail : `${ENV.ADMIN_URL}/userInfo/getUserDetail.do`,
            getUserInfo: `${ENV.ADMIN_URL}/userInfo/getUserInfo.do`,
            getRoleListForInvestigation: `${ENV.ADMIN_URL}/userInfo/getRoleListForInvestigation.do`,
            getInvestigationRoleList: `${ENV.ADMIN_URL}/userInfo/getInvestigationRoleList.do`,
            getSiteRoleList: `${ENV.ADMIN_URL}/userInfo/getSiteRoleList.do`,
            queryPIList: `${ENV.ADMIN_URL}/user/queryPIList.do`,
            queryCRAList: `${ENV.ADMIN_URL}/user/queryCRAList.do`,
            queryCRCList: `${ENV.ADMIN_URL}/user/queryCRCList.do`,
            addPI: `${ENV.ADMIN_URL}/user/addPI.do`,
            addCRA: `${ENV.ADMIN_URL}/user/addCRA.do`,
            removePI: `${ENV.ADMIN_URL}/user/removePI.do`,
            removeCRA: `${ENV.ADMIN_URL}/user/removeCRA.do`,
            getEmployeeCode: `${ENV.SAML_URL}/getEmployeeCode.do`,
            registerDutyTime: `${ENV.ADMIN_URL}/user/registerDutyTime.do`,
            queryEvaluationList: `${ENV.ADMIN_URL}/user/queryEvaluationList.do`,
            queryEvaluation: `${ENV.ADMIN_URL}/user/queryEvaluation.do`,
            saveEvaluation: `${ENV.ADMIN_URL}/user/saveEvaluation.do`,
            


            queryEmployeeList: `${ENV.ADMIN_URL}/user/queryEmployeeList.do`,
            queryEnterpriseUserById: `${ENV.ADMIN_URL}/user/queryEnterpriseUserById.do`,
            queryEmployeeByCond: `${ENV.ADMIN_URL}/user/queryEmployeeByCond.do`,
            queryUserEfficiency: `${ENV.ADMIN_URL}/efficiency/queryUserEfficiency.do`,
            queryUserEfficiencyByUser: `${ENV.ADMIN_URL}/efficiency/queryUserEfficiencyByUser.do`,
            fteSettleInfo: `${ENV.ADMIN_URL}/handover/fteSettleInfo.do`,
            prospectiveAssign: `${ENV.ADMIN_URL}/handover/prospectiveAssign.do`,
            assignEmployee: `${ENV.ADMIN_URL}/handover/assignEmployee.do`,
            confirmRequirement: `${ENV.ADMIN_URL}/handover/confirm.do`,
            rejectHandoverAssign: `${ENV.ADMIN_URL}/handover/rejectHandoverAssign.do`,
            queryHandoverReport: `${ENV.ADMIN_URL}/handover/queryHandoverReport.do`,
            queryUserAnalyse: `${ENV.ADMIN_URL}/user/queryUserAnalyse.do`,
            queryUserByExpandCond: `${ENV.ADMIN_URL}/user/queryUserByExpandCond.do`,

        },
        execute: {
            getCategoryTree: `${ENV.ADMIN_URL}/executeMgr/getExecuteCategoryTree.do`,
            addExecuteDefine: `${ENV.ADMIN_URL}/executeMgr/addExecuteDefine.do`,
            updateExecuteDefine: `${ENV.ADMIN_URL}/executeMgr/updateExecuteDefine.do`,
            deleteExecuteDefine: `${ENV.ADMIN_URL}/executeMgr/deleteExecuteDefine.do`,
            sortExecuteDefine: `${ENV.ADMIN_URL}/executeMgr/sortExecuteDefine.do`,
            updateExecuteDefineOption: `${ENV.ADMIN_URL}/executeMgr/updateExecuteDefineOption.do`,
            getInvestigationCheckList: `${ENV.ADMIN_URL}/executeMgr/getInvestigationCheckList.do`,
            addInvestigationCheckList: `${ENV.ADMIN_URL}/executeMgr/addInvestigationCheckList.do`,
            updateInvestigationCheckList: `${ENV.ADMIN_URL}/executeMgr/updateInvestigationCheckList.do`,
            deleteInvestigationCheckList: `${ENV.ADMIN_URL}/executeMgr/deleteInvestigationCheckList.do`,
            sortInvestigationCheckList: `${ENV.ADMIN_URL}/executeMgr/sortInvestigationCheckList.do`,
            list: `${ENV.ADMIN_URL}/execute/queryCrfData.do`,
            view: `${ENV.ADMIN_URL}/investigation/viewDetail.do`,
            update: `${ENV.ADMIN_URL}/investigation/updateInvestigation.do`,
            save: `${ENV.ADMIN_URL}/execute/saveCrfData.do`,
            manHourList: `${ENV.ADMIN_URL}/investigation/queryManHourTypeDictionaryTable.do`,
            queryEnterpriseWorkCategory: `${ENV.ADMIN_URL}/manHour/queryEnterpriseWorkCategory.do`,
            addInvestigationWorkCategory: `${ENV.ADMIN_URL}/investigation/addInvestigationWorkCategory.do`,
            deleteCrfRowData: `${ENV.ADMIN_URL}/execute/deleteCrfRowData.do`,
            querySiteData: `${ENV.ADMIN_URL}/execute/querySiteData.do`,
            saveSiteData: `${ENV.ADMIN_URL}/execute/saveSiteData.do`,
            queryPatientCodeList: `${ENV.ADMIN_URL}/execute/queryPatientCodeList.do`,
            queryHandoverList: `${ENV.ADMIN_URL}/handover/queryHandoverList.do`,
            addHandover: `${ENV.ADMIN_URL}/handover/addHandover.do`,
            queryCRCListByKeyword: `${ENV.ADMIN_URL}/user/queryCRCListByKeyword.do`,
            queryCRCListByKeywordForHandover : `${ENV.ADMIN_URL}/user/queryCRCListByKeywordForHandover.do`,
            modifyHandover: `${ENV.ADMIN_URL}/handover/modifyHandover.do`,
            queryBySiteId: `${ENV.ADMIN_URL}/investigation/site/queryBySiteId.do`,
            queryHandover: `${ENV.ADMIN_URL}/handover/queryHandover.do`,
            deleteHandover: `${ENV.ADMIN_URL}/handover/deleteHandover.do`,
            confirmHandoverReport: `${ENV.ADMIN_URL}/handover/confirmHandoverReport.do`,
            completeHandover: `${ENV.ADMIN_URL}/handover/completeHandover.do`,
            saveHandoverReport: `${ENV.ADMIN_URL}/handover/saveHandoverReport.do`,
            returnHandoverReport: `${ENV.ADMIN_URL}/handover/returnHandoverReport.do`,
            queryReturnRecords: `${ENV.ADMIN_URL}/handover/queryReturnRecords.do`,
            getPlanVisitDate: `${ENV.ADMIN_URL}/visitType/getPlanVisitDate.do`,
            listQuestionCategory: `${ENV.ADMIN_URL}/qa/listQuestionCategory.do`,
            createQuestionCategory: `${ENV.ADMIN_URL}/qa/createQuestionCategory.do`,
            modifyQuestionCategory: `${ENV.ADMIN_URL}/qa/modifyQuestionCategory.do`,
            deleteQuestionCategory: `${ENV.ADMIN_URL}/qa/deleteQuestionCategory.do`,
            sortQuestionCategory: `${ENV.ADMIN_URL}/qa/sortQuestionCategory.do`,
            createQuestion: `${ENV.ADMIN_URL}/qa/createQuestion.do`,
            listQuestionNotReply: `${ENV.ADMIN_URL}/qa/listQuestionNotReply.do`,
            deleteQuestion: `${ENV.ADMIN_URL}/qa/deleteQuestion.do`,
            queryQuestionById: `${ENV.ADMIN_URL}/qa/queryQuestionById.do`,
            modifyQuestion: `${ENV.ADMIN_URL}/qa/modifyQuestion.do`,
            answerQuestion: `${ENV.ADMIN_URL}/qa/answerQuestion.do`,
            listQuestionReplyed: `${ENV.ADMIN_URL}/qa/listQuestionReplyed.do`,
            modifyAnswer: `${ENV.ADMIN_URL}/qa/modifyAnswer.do`,
            exportList: `${ENV.ADMIN_URL}/handover/exportList.do`,
            exportSite: `${ENV.ADMIN_URL}/execute/exportSite.do`,
            queryUserFteSummary:`${ENV.ADMIN_URL}/invSiteUserSummary/queryUserFteSummary.do`,
            comfirmUserFteMonthOffset:`${ENV.ADMIN_URL}/invSiteUserSummary/comfirmUserFteMonthOffset.do`,
            comfirmUserFteMonthAll:`${ENV.ADMIN_URL}/invSiteUserSummary/comfirmUserFteMonthAll.do`,
            comfirmUserFteMonthOne:`${ENV.ADMIN_URL}/invSiteUserSummary/comfirmUserFteMonthOne.do`,
        },
        plan: {
            degreeList: `${ENV.ADMIN_URL}/investigation/degree/list.do`,
            degreeOptionList: `${ENV.ADMIN_URL}/investigation/degree/optionList.do`,
            queryDegreeById: `${ENV.ADMIN_URL}/investigation/degree/queryDegreeById.do`,
            modifyDegree: `${ENV.ADMIN_URL}/investigation/degree/modify.do`,
            deleteDegree: `${ENV.ADMIN_URL}/investigation/degree/delete.do`,
            sortDegree: `${ENV.ADMIN_URL}/investigation/degree/sortDegree.do`,
            getDegreeChart: `${ENV.ADMIN_URL}/investigation/degree/getDegreeChart.do`,
            visitTypeDataList: `${ENV.ADMIN_URL}/visitType/listVisitType.do`,
            getVisitType: `${ENV.ADMIN_URL}/visitType/getVisitType.do`,
            addVisitType: `${ENV.ADMIN_URL}/visitType/addVisitType.do`,
            deleteVisitType: `${ENV.ADMIN_URL}/visitType/deleteVisitType.do`,
            updateVisitType: `${ENV.ADMIN_URL}/visitType/updateVisitType.do`,
            sortVisitType: `${ENV.ADMIN_URL}/visitType/sortVisitType.do`,
            invDataList: `${ENV.ADMIN_URL}/investigation/plan/query.do`,
            modifyPlan: `${ENV.ADMIN_URL}/investigation/plan/modify.do`,
            addMonthlyPlan: `${ENV.ADMIN_URL}/investigation/plan/monthly/add.do`,
            deleteMonthlyPlan: `${ENV.ADMIN_URL}/investigation/plan/monthly/delete.do`,
            modifyMonthlyPlan: `${ENV.ADMIN_URL}/investigation/plan/monthly/modify.do`,
            siteDataList: `${ENV.ADMIN_URL}/investigation/site/plan/list.do`,
            querySitePlanData: `${ENV.ADMIN_URL}/investigation/site/plan/query.do`,
            saveSitePlan: `${ENV.ADMIN_URL}/investigation/site/plan/save.do`,
            saveSiteMonthlyPlan: `${ENV.ADMIN_URL}/investigation/site/plan/monthly/save.do`,
            degreeUnuseList: `${ENV.ADMIN_URL}/investigation/degree/queryDegreeNotUsed.do`,
            addDegreeList: `${ENV.ADMIN_URL}/investigation/degree/addInvestigationDegree.do`,
        },
        site: {
            list: `${ENV.ADMIN_URL}/investigation/site/querySiteList.do`,
            queryBySiteId: `${ENV.ADMIN_URL}/investigation/site/queryBySiteId.do`,
            addSite: `${ENV.ADMIN_URL}/investigation/site/add.do`,
            modifySite: `${ENV.ADMIN_URL}/investigation/site/modifySiteInfo.do`,
            delSite: `${ENV.ADMIN_URL}/investigation/site/del.do`,
            querySiteDetailList: `${ENV.ADMIN_URL}/investigation/site/querySiteDetailList.do`,
            queryUserSiteList: `${ENV.ADMIN_URL}/investigation/site/queryUserSiteList.do`,
            queryUserSiteListByUserId: `${ENV.ADMIN_URL}/manHour/queryInvestigationSiteByUserId.do`,
        },
        common: {
            arealist: `${ENV.ADMIN_URL}/entManager/getRegionListByParentId.do`, // 获取省市接口（一级行政单位
        },
        investigation: {
            getheader: `${ENV.ADMIN_URL}/investigation/getHeader.do`,  //拿表头
            getSiteHeader: `${ENV.ADMIN_URL}/investigation/site/header/get.do`,  //项目内拿表头
            list: `${ENV.ADMIN_URL}/investigation/queryInvestigationList.do`,
            updateInvestigation: `${ENV.ADMIN_URL}/investigation/updateInvestigation.do`,
            del: `${ENV.ADMIN_URL}/investigation/delete.do`,
            view: `${ENV.ADMIN_URL}/investigation/viewDetail.do`,
            getBaseInfo: `${ENV.ADMIN_URL}/investigation/getBaseInfo.do`,
            create: `${ENV.ADMIN_URL}/entManager/addInvestigation.do`,
            update: `${ENV.ADMIN_URL}/investigation/updateInvestigation.do`,
            appointMember: `${ENV.ADMIN_URL}/investigation/appointMember.do`,
            queryUserByKey: `${ENV.ADMIN_URL}/entManager/queryUserByKey.do`,
            updateStatus: `${ENV.ADMIN_URL}/investigation/updateStatus.do`,
            queryInvestigationSiteByKeyword: `${ENV.ADMIN_URL}/investigation/site/queryKeyword.do`,
            getInvestigationList: `${ENV.ADMIN_URL}/investigation/getInvestigationList.do`,
            getInvestigationSiteList: `${ENV.ADMIN_URL}/investigation/getInvestigationSiteList.do`,
            queryUserInvestigationList: `${ENV.ADMIN_URL}/investigation/queryUserInvestigationList.do`,
            queryUserInvestigationList2: `${ENV.ADMIN_URL}/manHour/queryInvesAndWorkCategoryByUserId.do`,
            queryInvJde: `${ENV.ADMIN_URL}/invesJde/queryInvestigation.do`,
            setUpMainJdeCode: `${ENV.ADMIN_URL}/invesJde/setUpMainJdeCode.do`,
            listChildrenJde: `${ENV.ADMIN_URL}/invesJde/listChildrenJde.do`,
            addChildrenJde: `${ENV.ADMIN_URL}/invesJde/addChildrenJde.do`,
            deleteChildrenJde: `${ENV.ADMIN_URL}/invesJde/deleteChildrenJde.do`,
            modifyChildrenJde: `${ENV.ADMIN_URL}/invesJde/modifyChildrenJde.do`,
            addJdeCodeSite: `${ENV.ADMIN_URL}/invesJde/addJdeCodeSite.do`,
            relieveJdeInvestigationSite: `${ENV.ADMIN_URL}/invesJde/relieveJdeInvestigationSite.do`,
            listJdeInvestigationSite: `${ENV.ADMIN_URL}/invesJde/listJdeInvestigationSite.do`,
            listJdeContractSite: `${ENV.ADMIN_URL}/invesJde/listJdeContractSite.do`,
            exportJdeContractSite: `${ENV.ADMIN_URL}/invesJde/exportJdeContractSite.do`,
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
            querydepartment: `${ENV.ADMIN_URL}/entManager/queryDepByHospitalEnterpriseByHospitalId.do`, // 查询科室列表
            addDoctor: `${ENV.ADMIN_URL}/entManager/addHospitalDepartmentDoctor.do`, // 添加部门下的医生
            editDoctor: `${ENV.ADMIN_URL}/entManager/modifyHospitalDepartmentDoctor.do`, // 修改部门下的医生
            delDoctor: `${ENV.ADMIN_URL}/entManager/removeHospitalDepartmentDoctor.do`, // 删除部门下的医生
            queryDepWhenAddDoctor: `${ENV.ADMIN_URL}/entManager/queryDepWhenAddDoctor.do`, // 删除部门下的医生
            hospitallist: `${ENV.ADMIN_URL}/hospital/hospital/list.do`, 
            queryInvesByHospitId: `${ENV.ADMIN_URL}/hospital/queryInvesByHospitId.do`, 
            queryDepartmentListByInves: `${ENV.ADMIN_URL}/hospital/queryDepartmentListByInves.do`,
            queryInvesByHospitalDepartmentId: `${ENV.ADMIN_URL}/hospital/queryInvesByHospitalDepartmentId.do`,
            queryDoctorListByInves: `${ENV.ADMIN_URL}/hospital/queryDoctorListByInves.do`,
            queryInvesByDoctorUserId: `${ENV.ADMIN_URL}/hospital/queryInvesByDoctorUserId.do`,
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
        manhour: {
            list: `${ENV.ADMIN_URL}/manHour/queryManHourDetailByDay.do`,//B2.1-填写工时-天工时列表
            exportManHourDetail: `${ENV.ADMIN_URL}/manHour/exportManHourDetail.do`,//导出一段时间内工时信息
            timetoggle: `${ENV.ADMIN_URL}/manHour/addManHourDetailAutoCounting.do`,//B2.1-填写工时-开始计时
            timeSave: `${ENV.ADMIN_URL}/manHour/addManHour.do`,//计时新增工时记录
            editSave: `${ENV.ADMIN_URL}/manHour/addManHour.do`,//编辑新增工时记录
            queryCategory: `${ENV.ADMIN_URL}/manHour/queryInvesAndWorkCategoryByUserId.do`,// 选项目名称
            queryInvestigation: `${ENV.ADMIN_URL}/investigation/site/queryKeyword.do`,// 选中心名称
            queryRole: `${ENV.ADMIN_URL}/manHour/queryInvesSiteRoleCodeByUserId.do`,// 选中角色
            queryWorkTypeIsNotRelateInves: `${ENV.ADMIN_URL}/manHour/queryWorkTypeIsNotRelateInves.do`,// 选中角色
            queryWorkType: `${ENV.ADMIN_URL}/manHour/queryWorkTypeRelateInves.do`,// 选工作类型
            queryWorkTypeNot: `${ENV.ADMIN_URL}/manHour/queryWorkTypeIsNotRelateInves.do`,// 选工作类型(不相关)
            view: `${ENV.ADMIN_URL}/manHour/queryManHourDetailByManHourId.do`,// 单项详细情况
            editmanhour: `${ENV.ADMIN_URL}/manHour/addManHourDetailManualCounting.do`,// 修改工时保存
            editaddmanhour: `${ENV.ADMIN_URL}/manHour/addManHourManual.do`,// 修改新增保存
            timeaddmanhour: `${ENV.ADMIN_URL}/manHour/addManHourCounting.do`,// 计时新增保存
            delmanhour: `${ENV.ADMIN_URL}/manHour/deleteManHourById.do`,// 删除工时记录
            caculateMonthlyFte: `${ENV.ADMIN_URL}/manHour/caculateMonthlyFte.do`,// 月度fte
            queryManHourWeekly: `${ENV.ADMIN_URL}/manHour/queryManHourWeekly.do`,// 周报
            exportManHourWeekly: `${ENV.ADMIN_URL}/manHour/exportManHourWeekly.do`,// 周报
            querySearch:`${ENV.ADMIN_URL}/manHour/queryManHourCrccOrCrcm.do`,
            queryManHourList: `${ENV.ADMIN_URL}/manHour/queryManHourList.do`,
            verifyManHour: `${ENV.ADMIN_URL}/manHour/verifyManHour.do`,
            queryEfficiency: `${ENV.ADMIN_URL}/efficiency/queryEfficiency.do`,
            queryManHourReport:`${ENV.ADMIN_URL}/manHour/queryManHourReport.do`,
            exportManHourCrccOrCrcm:`${ENV.ADMIN_URL}/manHour/exportManHourCrccOrCrcm.do`
        },
        member: {
            listRequireMents: `${ENV.ADMIN_URL}/requirement/list.do`,
            addRequireMents: `${ENV.ADMIN_URL}/requirement/add.do`,
            modifyRequireMents: `${ENV.ADMIN_URL}/requirement/modify.do`,
            changeRequirement :`${ENV.ADMIN_URL}/requirement/change.do`,
            getRequireMents: `${ENV.ADMIN_URL}/requirement/get.do`,
            deleteRequireMents: `${ENV.ADMIN_URL}/requirement/delete.do`,
            fteSettleInfo: `${ENV.ADMIN_URL}/requirement/fteSettleInfo.do`,
            assignEmployee: `${ENV.ADMIN_URL}/requirement/assignEmployee.do`,
            prospectiveAssign: `${ENV.ADMIN_URL}/requirement/prospectiveAssign.do`,
            getEmployeeInfo: `${ENV.ADMIN_URL}/requirement/assigned/invInfo.do`,
            queryFteAssignDetail: `${ENV.ADMIN_URL}/requirement/fte/assignList.do`,
            confirmRequirement: `${ENV.ADMIN_URL}/requirement/confirm.do`,
            refuseRequirement: `${ENV.ADMIN_URL}/requirement/reject.do`,
            export: `${ENV.ADMIN_URL}/requirement/export.do`,
        },
        entmanager: {
            list: `${ENV.ADMIN_URL}/sysManager/listAllEnterprise.do`,
            view: `${ENV.ADMIN_URL}/sysManager/queryEnterpriseById.do`,
            addUser: `${ENV.ADMIN_URL}/sysManager/addUser.do`, //添加用户
            changeEntManger: `${ENV.ADMIN_URL}/sysManager/changeEntManger.do`, //配置/变更企业管理员
            queryAllUser: `${ENV.ADMIN_URL}/sysManager/queryAllUser.do`, //查询用户列表
            changeUserStatus: `${ENV.ADMIN_URL}/user/changeUserStatus.do`, //启用/停用某个用户
            changeEntStatus: `${ENV.ADMIN_URL}/sysManager/changeEntStatus.do`, //启用/停用某个企业
        },
        project:{
            list: `${ENV.ADMIN_URL}/sysManager/listAllEnterprise.do`,

        },
        summary:{
            list: `${ENV.ADMIN_URL}/investigationSummary/querySummaryByStatisticalTypes.do`, //随机
            visit: `${ENV.ADMIN_URL}/investigationSummary/queryVisitType.do`,  //完成访视数            
            site: `${ENV.ADMIN_URL}/investigationSummary/querySitesSummary.do`,  //各中心。。。
            queryFTE: `${ENV.ADMIN_URL}/investigationSummary/querySummaryFTE.do`,  //fte
            querySiteFTE: `${ENV.ADMIN_URL}/investigationSummary/querySitesSummaryFTE.do`,  //中心fte
            queryPatientSource: `${ENV.ADMIN_URL}/investigationSummary/queryPatientSource.do`,  //筛选来源统计（患者来源）
            queryFilterFailReason: `${ENV.ADMIN_URL}/investigationSummary/queryFilterFailReason.do`,  //筛选失败原因统计
            queryPatientAmount: `${ENV.ADMIN_URL}/investigationSummary/queryPatientAmount.do`,  //病例数记录统计
            getRegionTree: `${ENV.ADMIN_URL}/investigationSummary/getRegionTree.do`,  //企业-大区-省市汇总（树结构）
            querySummary: `${ENV.ADMIN_URL}/invSiteWeekSummary/querySummary.do`,  //项目/中心周汇总
            queryMonthSummary: `${ENV.ADMIN_URL}/invSiteWeekSummary/queryMonthSummary.do`,//项目/月汇总
            queryMySummary: `${ENV.ADMIN_URL}/invSiteWeekSummary/queryMySummary.do`,  //我的周报-项目详情/中心详情
            updateComment: `${ENV.ADMIN_URL}/invSiteWeekSummary/updateComment.do`,
            exportMonthSummary: `${ENV.ADMIN_URL}/invSiteWeekSummary/exportMonthSummary.do`,//月汇总导出
            exportSummary: `${ENV.ADMIN_URL}/invSiteWeekSummary/exportSummary.do`,  //项目/中心周汇总  导出
            exportPatientAmount: `${ENV.ADMIN_URL}/investigationSummary/exportPatientAmount.do`,  //病例数记录统计  导出
            exportMySummary: `${ENV.ADMIN_URL}/invSiteWeekSummary/exportMySummary.do`,  //我的周报-项目详情/中心详情  导出
            
        },
        export:{
            exportInvestigationPlan: `${ENV.ADMIN_URL}/export/exportInvestigationPlan.do`,
            exportSitesPlan: `${ENV.ADMIN_URL}/export/exportSitesPlan.do`,
            exportVisitType: `${ENV.ADMIN_URL}/export/exportVisitType.do`,
            exportManHourList: `${ENV.ADMIN_URL}/manHour/exportManHourList.do`,
            exportManHourReport:`${ENV.ADMIN_URL}/manHour/exportManHourReport.do`,
            exportTypeVisit:`${ENV.ADMIN_URL}/execute/exportCrfData.do`,
            exportUserEfficiency: `${ENV.ADMIN_URL}/efficiency/exportUserEfficiency.do`,
            exportUserFteSummary:`${ENV.ADMIN_URL}/invSiteUserSummary/exportUserFteSummary.do`,
        },
		sumtotal:{
            queryInvestigationFinishedPercentage:`${ENV.ADMIN_URL}/finishedPercentage/queryInvestigationFinishedPercentage.do`,
            queryAllInvestigation:`${ENV.ADMIN_URL}/finishedPercentage/queryAllInvestigation.do`,
            exportInvestigationFinishedPercentage:`${ENV.ADMIN_URL}/finishedPercentage/exportInvestigationFinishedPercentage.do`,
            queryAllInvestigationPm:`${ENV.ADMIN_URL}/finishedPercentage/queryAllInvestigationPm.do`,
        },
	};
}

export {API_URL as default, STATIC};
