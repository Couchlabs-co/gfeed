import {render, screen} from '@testing-library/svelte';
import { expect, test} from 'vitest';

import Footer from './Footer.svelte';

test('Renders Footer correctly', async () => {
    render(Footer);
    
    const FooterText = screen.getByText('Copyright © 2024 - All right reserved by GFeed');
    expect(FooterText).toBeInTheDocument();
});
