
const DEV = {
    ADMIN_URL: 'http://192.168.10.202:8091/management',
    MANAGER_URL: '/manager',
};

const TEST = {
    ADMIN_URL: 'http://192.168.10.126:8501/management',
    MANAGER_URL: '/manager',
};

const PRODUCTION = {
    ADMIN_URL: 'http://101.37.16.69:13000/management',
    MANAGER_URL: '/manager',
};

const LOC = {
    ADMIN_URL: 'http://localhost:8091/management',
    MANAGER_URL: '/manager',
};

const CONFIG = window.configs;

// export const ENV = DEV;
// export const ENV = TEST;
// export const ENV = PRODUCTION;
//  export const ENV = LOC;
export const ENV = CONFIG;


export { ENV as default };
