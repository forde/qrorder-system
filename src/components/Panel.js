import React from 'react';
import Paper from 'material-ui/Paper';
import styled from 'styled-components';

const Panel = props => {
    return (
        <PaperWrapper elevetion={4} style={props.style}>
			{props.children}
		</PaperWrapper>
    )
}

export default Panel;

const PaperWrapper = styled(Paper)`
    padding: 30px;
    margin-bottom:30px;
    overflow:hidden;
`