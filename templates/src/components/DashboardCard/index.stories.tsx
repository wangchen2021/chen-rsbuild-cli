import type { Meta, StoryObj } from 'storybook-react-rsbuild';

import Index from './index';

const meta = {
  component: Index,
} satisfies Meta<typeof Index>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: 'icon',
    title: 'title',
    description: 'description',
    statValue: 'statValue',
    statLabel: 'statLabel',
  },
};
