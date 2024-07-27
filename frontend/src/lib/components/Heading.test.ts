import {render, screen} from '@testing-library/svelte';
import { expect, test} from 'vitest';

import Heading from './Heading.svelte';

test('Renders heading correctly when subheading is not passed', async () => {
    render(Heading, {heading: 'Hello, World!'})
    
    const heading = screen.getByTestId('heading');
    expect(heading).toBeInTheDocument();
    try{
        screen.getByTestId('subHeading');
    }
    catch(e){
        expect(e).toBeDefined();
    }
});

test('Renders heading correctly when subheading is passed', async () => {
    render(Heading, {heading: 'Hello, World!', subHeading: 'This is a subheading'})
    
    const heading = screen.getByTestId('heading');
    const subHeading = screen.getByTestId('subHeading');
    expect(heading).toBeInTheDocument();
    expect(subHeading).toBeInTheDocument();
});