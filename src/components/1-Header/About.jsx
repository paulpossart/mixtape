import React, { useState } from "react";
import buttons from '../../styles/buttons.module.scss'
import figma from '../../assets/figma-svgrepo-com.svg'
import github from '../../assets/github-color-svgrepo-com.svg'

function About() {

    return (
        <div style={{ lineHeight: '0' }}>
            <a
                href="https://www.figma.com/design/8GNRvuZfj11OSnSM9vvWe3/mixtape?node-id=0-1&t=RIrddnyUH6UBbS1c-1"
                target="blank"
                rel="noopener noreferrer"
            >
                <img src={figma} className={buttons.buttonLink} />
            </a>
            <a
                href="https://github.com/paulpossart/mixtape"
                target="blank"
                rel="noopener noreferrer"
            >
                <img src={github} className={buttons.buttonLink} />
            </a>
        </div>
    );
}

export default About;
