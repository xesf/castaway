import React from 'react';
import { map } from 'lodash';

const ScriptLine = ({ script }) => {
    return (
        <React.Fragment>
            {(script.opcode === 0x1110) &&
                <tr>
                    <td style={{ width: '40px' }}>
                        &nbsp;
                    </td>
                    <td>
                    </td>
                </tr>
            }
            <tr>
                <td style={{
                    width: '40px',
                    paddingRight: '8px',
                    color: 'gray',
                    textAlign: 'right',
                }}>
                    {!script.tag && script.lineNumber}
                </td>
                <td style={{
                    fontWeight: (script.tag) ? 'bold' : 'none',
                    color: (script.tag) ? 'red' : 'white'
                }}>
                    {script.line}
                </td>
            </tr>
            {(script.opcode === 0xffff) &&
                <tr>
                    <td style={{ width: '40px' }}>
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
                    <ScriptLine key={s+s.lineNumber} script={s} />
                )}
            </tbody>
        </table>
    );
};

export default ScriptCode;
