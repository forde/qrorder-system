import React from 'react';
import styled from 'styled-components';

const Loader = props => {
    return (
        <Container center={props.center}>
            <Spinner size={props.size} color={props.color} >
                <div className="dot1"></div>
                <div className="dot2"></div>
            </Spinner>
        </Container>
    )
}

export default Loader;

const Container = styled.div`
    position:relative;
    ${props => props.center ? `
        position:absolute;
        top: 50%;
        left:50%;
        transform: translateX(-50%) translateY(-50%);
    ` : ``}
`

const Spinner = styled.div`
    width: ${props => props.size || '50px'};
    height: ${props => props.size || '50px'};
    position: relative;
    -webkit-animation: sk-rotate 1.5s infinite linear;
    animation: sk-rotate 1.5s infinite linear;

    .dot1, .dot2 {
        width: 60%;
        height: 60%;
        display: inline-block;
        position: absolute;
        top: 0;
        background-color: ${props => props.color || '#000'};
        border-radius: 100%;
        
        -webkit-animation: sk-bounce 2.0s infinite ease-in-out;
        animation: sk-bounce 2.0s infinite ease-in-out;
    }
    
    .dot2 {
        top: auto;
        bottom: 0;
        -webkit-animation-delay: -1.0s;
        animation-delay: -1.0s;
    }
    
    @-webkit-keyframes sk-rotate { 100% { -webkit-transform: rotate(360deg) }}
    @keyframes sk-rotate { 100% { transform: rotate(360deg); -webkit-transform: rotate(360deg) }}
    
    @-webkit-keyframes sk-bounce {
        0%, 100% { -webkit-transform: scale(0.0) }
        50% { -webkit-transform: scale(1.0) }
    }
    
    @keyframes sk-bounce {
        0%, 100% { 
            transform: scale(0.0);
            -webkit-transform: scale(0.0);
        } 50% { 
            transform: scale(1.0);
            -webkit-transform: scale(1.0);
        }
    }
`