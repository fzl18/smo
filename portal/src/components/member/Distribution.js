/**
 * Created by casteloyee on 2017/7/18.
 */
import React from 'react';
import MemberSider from './MemberSider';
import ENV from '../../common/env.js';
import UserSider from '../user/UserSider';

class Iframe extends React.Component {         
    render() {
      return(         
        <div>          
          <iframe src={this.props.src} height={this.props.height} width={this.props.width} frameBorder={0}/>         
        </div>
      )
    }
  };

class Distribution extends React.Component {
    state = {
        loading: false,
        dataList: [],
    };

    getMap = () => {
        
    }

    render() {
        //require('../../../public/map.html');
        const srcUrl = `${ENV.SAML_URL}/lib/map.html`
        return (
            <div className="content">
                {
                    this.props.src === "UserManage" ?
                    <UserSider selectKey='UserDist' />
                    :
                    <MemberSider selectKey='memberRequire' />
                }
                <div className="main map-iframe">
                    <Iframe src={srcUrl} height="500" width="800"/>
                </div>
            </div>
        );
    }
}

export default Distribution;
