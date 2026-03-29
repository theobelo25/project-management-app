import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Button } from '@web/components/ui/button';

/**
 * Primary actions use the default variant; destructive and outline are used for
 * secondary flows. Interaction tests below document click behavior for regression safety.
 */
const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Project buttons use CVA variants aligned with shadcn-style tokens. Stories include automated interaction checks you can show in a portfolio or CI.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'outline',
        'secondary',
        'ghost',
        'destructive',
        'link',
      ],
    },
    size: {
      control: 'select',
      options: [
        'default',
        'xs',
        'sm',
        'lg',
        'icon',
        'icon-xs',
        'icon-sm',
        'icon-lg',
      ],
    },
    disabled: { control: 'boolean' },
  },
  args: {
    children: 'Button',
    variant: 'default',
    size: 'default',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Outline: Story = {
  args: { variant: 'outline', children: 'Cancel' },
};

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Delete project' },
};

export const Disabled: Story = {
  args: { disabled: true, children: 'Unavailable' },
};

/** Visual matrix of variants—useful for design review and Chromatic snapshots. */
export const AllVariants: Story = {
  render: () => (
    <div className="flex max-w-lg flex-wrap gap-2">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

/**
 * Interaction test: documents that the primary action receives clicks as expected.
 * Visible in the Storybook Interactions panel and in Vitest browser runs.
 */
export const ClickInvokesHandler: Story = {
  args: {
    children: 'Save changes',
    onClick: fn(),
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('User activates the button', async () => {
      await userEvent.click(
        canvas.getByRole('button', { name: 'Save changes' }),
      );
    });
    await step('Handler runs once', async () => {
      await expect(args.onClick).toHaveBeenCalledTimes(1);
    });
  },
};
