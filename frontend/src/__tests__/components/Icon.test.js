import React from 'react'
import { render, screen, cleanup, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Icon } from '../../components/Icon.js'

describe('Icon component', () => {
    afterEach(() => {
        cleanup()
    })    
    it('renders SVG icon correctly', () => {
        const MockSvgIcon = () => {
            return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"></svg>)
        }
        render(<Icon icon={ MockSvgIcon } />)
        expect(screen.getByRole("button").querySelector('svg')).not.toBe(null)
    })
    it("renders tooltip when hovered over", async () => {
        render(<Icon tooltip="Tooltip" />)
        const triggerElement = screen.getByRole("button")
        userEvent.hover(triggerElement)
        await waitFor(() => {
            expect(screen.getByRole("tooltip", { hidden: true })).toBeVisible();
        });
    })
})