import { PowerBIEmbed } from 'powerbi-client-react';
import {models} from 'powerbi-client'


function Dashboard() {
    const iframeStyle = {
        width: '1140px', // Set the desired width
        height: '541.25px', // Set the desired height
        border: '1px solid #ccc', // Add border
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)', // Add shadow
        overflow: 'hidden' // Hide overflow content
    };

    return (
        <iframe
            title="ETMS_Report"
            style={iframeStyle}
            src="https://app.powerbi.com/reportEmbed?reportId=ca338622-1140-4a6d-9dcc-e4048fc947fb&autoAuth=true&ctid=2800c0a0-70e9-49be-8733-faeaa6aced99&filterPaneEnabled=false"
            frameBorder="0"
            allowFullScreen
        ></iframe>
    );
}

export default Dashboard