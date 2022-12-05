import React, { useState, useEffect } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import '../../css/main.css';
import ResFolders from './ResFolder';
import ResTezt from './ResTezt';
import ResDocument from './ResDocument';

const AllSubjectResources = (props) => {
    const [resource, setrources] = useState();
    useEffect(() => {
        if (props.subjectMain) {
            setrources(true);
        } else {
            setrources(false);
        }
    }, []);
    return (
        <>
            <div className="semester-credit profile-education pt-5" id="resources-sub">
                <div className="resourse-component">
                    <div className="container">
                        <h3 className="text-white">
                            <b>Resources</b>
                        </h3>
                    </div>
                    <Tabs defaultActiveKey="Folder" id="uncontrolled-tab-example" className="mb-3 mk-post ">
                        <Tab eventKey="Folder" title="Folder">
                            <ResFolders subjects={props.subject} setSubjectMain={resource} />
                        </Tab>
                        <Tab eventKey="Tezt" title="Tezt">
                            <ResTezt subjects={props.subject} setSubjectMain={resource} />
                        </Tab>

                        <Tab className={props.subject ? 'dddss' : 'sciencepage'} eventKey="Document" title="Document">
                            <ResDocument subjects={props.subject} setSubjectMain={resource} />
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </>
    );
};

export default AllSubjectResources;
