import { PowerBIEmbed } from 'powerbi-client-react';
import {models} from 'powerbi-client'

function Dashboard() {
    return (
        // <PowerBIEmbed
        //     embedConfig={{
        //         type: 'report',   // Supported types: report, dashboard, tile, visual, qna, paginated report and create
        //         id: '0063e1fb-bbd4-4691-b5a6-6f660c325f3b',
        //         embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=0063e1fb-bbd4-4691-b5a6-6f660c325f3b&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVVLLVNPVVRILUItUFJJTUFSWS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldCIsImVtYmVkRmVhdHVyZXMiOnsidXNhZ2VNZXRyaWNzVk5leHQiOnRydWV9fQ%3d%3d',
        //         accessToken: '<Access Token>',
        //         tokenType: models.TokenType.Embed, // Use models.TokenType.Aad for SaaS embed
        //         settings: {
        //             panes: {
        //                 filters: {
        //                     expanded: false,
        //                     visible: false
        //                 }
        //             },
        //             background: models.BackgroundType.Transparent,
        //         }
        //     }}

        //     eventHandlers={
        //         new Map([
        //             ['loaded', function () { console.log('Report loaded'); }],
        //             ['rendered', function () { console.log('Report rendered'); }],
        //             ['error', function (event) { console.log(event.detail); }],
        //             ['visualClicked', () => console.log('visual clicked')],
        //             ['pageChanged', (event) => console.log(event)],
        //         ])
        //     }

        //     cssClassName={"reportClass"}

        //     getEmbeddedComponent={(embeddedReport) => {
        //         window.report = embeddedReport ;
        //     }}
        // />
        <iframe title="ETMS_Report" width="1140" height="541.25" src="https://app.powerbi.com/reportEmbed?reportId=ca338622-1140-4a6d-9dcc-e4048fc947fb&autoAuth=true&ctid=2800c0a0-70e9-49be-8733-faeaa6aced99" frameborder="0" allowFullScreen="true"></iframe>

    )


}

export default Dashboard