import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { TaskComposer } from './task-composer';

const meta = {
  title: 'Composition/TaskComposer',
  component: TaskComposer,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Demonstrates multi-step user flows: typing, enabled/disabled controls, and callback assertions. This is the kind of story interviewers and clients look for in a public Storybook.',
      },
    },
  },
  args: {
    onAdd: fn(),
  },
} satisfies Meta<typeof TaskComposer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

/**
 * Full flow: type a title, submit, assert the parent received the trimmed value.
 */
export const SubmitsValidTask: Story = {
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Task title');

    await step('User enters a task title', async () => {
      await userEvent.type(input, '  Ship the roadmap doc  ');
    });

    await step('Submit is enabled with non-empty text', async () => {
      await expect(
        canvas.getByRole('button', { name: 'Add task' }),
      ).toBeEnabled();
    });

    await step('Submitting sends trimmed text to onAdd', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Add task' }));
      await expect(args.onAdd).toHaveBeenCalledWith('Ship the roadmap doc');
    });
  },
};

/**
 * Guard rail: empty or whitespace-only input keeps submit disabled and never calls onAdd.
 */
export const BlocksEmptySubmit: Story = {
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Submit starts disabled', async () => {
      await expect(
        canvas.getByRole('button', { name: 'Add task' }),
      ).toBeDisabled();
    });

    await step('Spaces alone do not enable submit', async () => {
      await userEvent.type(canvas.getByLabelText('Task title'), '   ');
      await expect(
        canvas.getByRole('button', { name: 'Add task' }),
      ).toBeDisabled();
      await expect(args.onAdd).not.toHaveBeenCalled();
    });
  },
};
