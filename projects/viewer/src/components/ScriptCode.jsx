import React from 'react';
import { map } from 'lodash';

const ScriptLine = ({ script, current }) => {
    const isCurrentLineStyle = (current) ? {
        backgroundColor: 'rgb(0, 136, 253)',
    } : {};

    return (
        <React.Fragment>
            {(script.opcode === 0x1110) &&
                <tr>
                    <td style={{ ...isCurrentLineStyle, width: '40px' }}>
                        &nbsp;
                    </td>
                    <td>
                    </td>
                </tr>
            }
            <tr>
                <td style={{
                    ...isCurrentLineStyle,
                    width: '40px',
                    paddingRight: '8px',
                    color: 'gray',
                    textAlign: 'right',
                }}>
                    <a name="1" href={`/#$script.lineNumber`} style={{display: 'none'}}>{!script.tag && script.lineNumber}</a>
                    {!script.tag && script.lineNumber}
                </td>
                <td style={{
                    ...isCurrentLineStyle,
                    fontWeight: (script.tag) ? 'bold' : 'normal',
                    color: (script.tag) ? 'red' : 'white',
                    paddingLeft: (script.indent) ? `${script.indent * 20}px` : '0px',
                }}>
                    {script.line}
                </td>
            </tr>
            {(script.opcode === 0xffff) &&
                <tr>
                    <td style={{ ...isCurrentLineStyle, width: '40px' }}>
                    &nbsp;
                    </td>
                    <td>
                    </td>
                </tr>
            }
        </React.Fragment>
    );
};

const ScriptCode = (props) => {
    return (
        <table style={{
            width: '100%', 
            fontSize: '12px',
            background: '#1b1c1d',
            color: 'white',
        }}>
            <tbody>
                {map(props.scripts, (s) =>
                    <ScriptLine key={s.lineNumber} script={s} current={(props.current) ? props.current.lineNumber === s.lineNumber : false} />
                )}
            </tbody>
        </table>
    );
};

export default ScriptCode;
