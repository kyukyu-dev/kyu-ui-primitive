import * as React from 'react';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Slot, Slottable } from './slot';
import { afterEach, describe, it, beforeEach, vi, expect } from 'vitest';

describe('given a slotted Trigger', () => {
  afterEach(cleanup);
  describe('with onClick on itself', () => {
    const handleClick = vi.fn();

    beforeEach(() => {
      handleClick.mockReset();
      render(
        <Trigger as={Slot} onClick={handleClick}>
          <button type="button">Click me</button>
        </Trigger>,
      );
      fireEvent.click(screen.getByRole('button'));
    });

    it('should call the onClick passed to the Trigger', async () => {
      expect(handleClick).toHaveBeenCalledOnce();
    });
  });

  describe('with onClick on the child', () => {
    const handleClick = vi.fn();

    beforeEach(() => {
      handleClick.mockReset();
      render(
        <Trigger as={Slot}>
          <button type="button" onClick={handleClick}>
            Click me
          </button>
        </Trigger>,
      );
      fireEvent.click(screen.getByRole('button'));
    });

    it("should call the child's onClick", async () => {
      expect(handleClick).toHaveBeenCalledOnce();
    });
  });

  describe('with onClick on itself AND the child', () => {
    const handleTriggerClick = vi.fn();
    const handleChildClick = vi.fn();

    beforeEach(() => {
      handleTriggerClick.mockReset();
      handleChildClick.mockReset();

      render(
        <Trigger as={Slot} onClick={handleTriggerClick}>
          <button type="button" onClick={handleChildClick}>
            Click me
          </button>
        </Trigger>,
      );
      fireEvent.click(screen.getByRole('button'));
    });

    it("should call the Trigger's onClick", async () => {
      expect(handleTriggerClick).toHaveBeenCalledOnce();
    });

    it("should call the child's onClick", async () => {
      expect(handleChildClick).toHaveBeenCalledOnce();
    });

    it("should call the child's onClick before Trigger's onClick", async () => {
      expect(handleChildClick).toHaveBeenCalledBefore(handleTriggerClick);
    });
  });

  describe('with onClick on itself AND undefined onClick on the child', () => {
    const handleTriggerClick = vi.fn();

    beforeEach(() => {
      handleTriggerClick.mockReset();
      render(
        <Trigger as={Slot} onClick={handleTriggerClick}>
          <button type="button" onClick={undefined}>
            Click me
          </button>
        </Trigger>,
      );
      fireEvent.click(screen.getByRole('button'));
    });

    it("should call the Trigger's onClick", async () => {
      expect(handleTriggerClick).toHaveBeenCalledOnce();
    });
  });

  describe('with undefined onClick on itself AND onClick on the child', () => {
    const handleChildClick = vi.fn();

    beforeEach(() => {
      handleChildClick.mockReset();
      render(
        <Trigger as={Slot} onClick={undefined}>
          <button type="button" onClick={handleChildClick}>
            Click me
          </button>
        </Trigger>,
      );
      fireEvent.click(screen.getByRole('button'));
    });

    it("should call the child's onClick", async () => {
      expect(handleChildClick).toHaveBeenCalledOnce();
    });
  });
});

describe('given a Button with Slottable', () => {
  afterEach(cleanup);
  describe('without asChild', () => {
    it('should render a button with icon on the left/right', async () => {
      const tree = render(
        <Button iconLeft={<span>left</span>} iconRight={<span>right</span>}>
          Button <em>text</em>
        </Button>,
      );

      expect(tree.container).toMatchSnapshot();
    });
  });

  describe('with asChild', () => {
    it('should render a link with icon on the left/right', async () => {
      const tree = render(
        <Button iconLeft={<span>left</span>} iconRight={<span>right</span>} asChild>
          <a href="https://www.google.com">
            Button <em>text</em>
          </a>
        </Button>,
      );

      expect(tree.container).toMatchSnapshot();
    });
  });
});

describe('given an Input', () => {
  const handleRef = vi.fn();

  beforeEach(() => {
    handleRef.mockReset();
  });

  afterEach(cleanup);

  describe('without asChild', () => {
    it('should only call function refs once', async () => {
      render(<Input ref={handleRef} />);
      await userEvent.type(screen.getByRole('textbox'), 'foo');
      expect(handleRef).toHaveBeenCalledOnce();
    });
  });

  // describe('with asChild', () => {
  //   it('should only call function refs once', async () => {
  //     render(
  //       <Input asChild ref={handleRef}>
  //         <input />
  //       </Input>,
  //     );
  //     await userEvent.type(screen.getByRole('textbox'), 'foo');
  //     expect(handleRef).toHaveBeenCalledOnce();
  //   });
  // });
});

type TriggerProps = React.ComponentProps<'button'> & { as: React.ElementType };
const Trigger = ({ as: Comp = 'button', ...props }: TriggerProps) => <Comp {...props} />;

const Button = React.forwardRef<
  React.ComponentRef<'button'>,
  React.ComponentProps<'button'> & {
    asChild?: boolean;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
  }
>(({ children, asChild = false, iconLeft, iconRight, ...props }, forwardedRef) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp {...props} ref={forwardedRef}>
      {iconLeft}
      <Slottable>{children}</Slottable>
      {iconRight}
    </Comp>
  );
});

const Input = React.forwardRef<
  React.ComponentRef<'input'>,
  React.ComponentProps<'input'> & {
    asChild?: boolean;
  }
>(({ asChild = false, children, ...props }, forwardedRef) => {
  const Comp = asChild ? Slot : 'input';
  const [value, setValue] = React.useState('');

  return (
    <Comp
      {...props}
      onChange={(event) => setValue(event.target.value)}
      ref={forwardedRef}
      value={value}
    >
      {children}
    </Comp>
  );
});
