import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SunIcon, MoonIcon, MonitorIcon, CheckIcon, MenuIcon } from './icons';

describe('Icon Components', () => {
  it('renders SunIcon with default class', () => {
    const { container } = render(<SunIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.classList.contains('h-5')).toBe(true);
    expect(svg?.classList.contains('w-5')).toBe(true);
  });

  it('renders SunIcon with custom class', () => {
    const { container } = render(<SunIcon className="h-6 w-6 text-primary" />);
    const svg = container.querySelector('svg');
    expect(svg?.classList.contains('h-6')).toBe(true);
    expect(svg?.classList.contains('w-6')).toBe(true);
    expect(svg?.classList.contains('text-primary')).toBe(true);
  });

  it('renders MoonIcon', () => {
    const { container } = render(<MoonIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('renders MonitorIcon', () => {
    const { container } = render(<MonitorIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('renders CheckIcon', () => {
    const { container } = render(<CheckIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('renders MenuIcon', () => {
    const { container } = render(<MenuIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('all icons have proper SVG attributes', () => {
    const icons = [SunIcon, MoonIcon, MonitorIcon, CheckIcon, MenuIcon];

    icons.forEach((Icon) => {
      const { container } = render(<Icon />);
      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('xmlns')).toBe('http://www.w3.org/2000/svg');
      expect(svg?.getAttribute('fill')).toBe('none');
      expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
      expect(svg?.getAttribute('stroke')).toBe('currentColor');
    });
  });
});
