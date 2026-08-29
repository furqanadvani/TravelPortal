import React, { useState } from 'react'
import { Segmented } from 'antd';
import './OrganizationView.css'
import EmployeesList from './EmployeesList';
import Departments from './Departments';
import { useACL } from '../../utils/acl/UseACL'
import { ACL_ACCESS_LIST, ACL_MODULES } from '../../utils/acl/Index';
import { ConditionalRendering } from '../../utils/Methods';

const OrganizationView = () => {

    const [selectedTab, setSelectedTab] = useState('Department');

    const { can } = useACL()

    const canViewEmployee = can(ACL_MODULES.MEMBERS, ACL_ACCESS_LIST.VIEW) || can(ACL_MODULES.DEPARTMENT, ACL_ACCESS_LIST.VIEW_DEPARTMENT_MEMBERS)

    const segmentToggler = (val) => {
        setSelectedTab(val);
    };

    return (
        <div className='teams-main'>
            <div className="teams-header">
                <div className="teams-header-left">
                    <div className="teams-heading">
                        <h3>Department</h3>
                    </div>
                    <div className="teams-segments">
                        <Segmented
                            options={['Department', 'Employees']}
                            onChange={value => segmentToggler(value)}
                        />
                    </div>
                </div>
                <div className="teams-header-right">
                </div>
            </div>

            <div className="teams-body">
                <div style={{ marginTop: '20px' }}>
                    {selectedTab === 'Department' && <Departments />}
                    <ConditionalRendering
                        condition={canViewEmployee}
                        children={selectedTab === 'Employees' && <EmployeesList />}
                    />
                </div>
            </div>


        </div>
    )
}

export default OrganizationView
