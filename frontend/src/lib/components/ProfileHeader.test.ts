import {render, screen} from '@testing-library/svelte';
import { expect, test} from 'vitest';

import ProfileHeader from './ProfileHeader.svelte';

test('Renders Profile Header correctly', async () => {
    render(ProfileHeader, {pic: 'someimage.jpg'})
    
    const imageTag = screen.getByRole('img');
    expect(imageTag).toBeInTheDocument();
});