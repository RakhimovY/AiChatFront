/**
 * Custom hook for handling dropdown positioning
 */
import { useState, useEffect, RefObject } from 'react';

interface UseDropdownPositionOptions {
  /**
   * Minimum space required below the button to position the dropdown below
   */
  minSpaceBelow?: number;
  
  /**
   * Width of the dropdown
   */
  dropdownWidth?: number;
}

interface DropdownPosition {
  /**
   * Position of the dropdown (top or bottom)
   */
  position: 'top' | 'bottom';
  
  /**
   * Style object for positioning the dropdown
   */
  style: {
    left: string;
    [key: string]: string;
  };
}

/**
 * Hook for calculating dropdown position
 */
export function useDropdownPosition(
  buttonRef: RefObject<HTMLElement>,
  isOpen: boolean,
  options: UseDropdownPositionOptions = {}
): DropdownPosition {
  const { minSpaceBelow = 300, dropdownWidth = 224 } = options;
  
  const [position, setPosition] = useState<'top' | 'bottom'>('bottom');
  const [style, setStyle] = useState<{ left: string; [key: string]: string }>({
    left: '0',
  });

  // Check position when window is resized or dropdown is opened
  useEffect(() => {
    if (!isOpen) return;

    const checkPosition = () => {
      if (buttonRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const spaceBelow = viewportHeight - buttonRect.bottom;

        // If there's less than minSpaceBelow below the button, position the dropdown above
        const newPosition = spaceBelow < minSpaceBelow ? 'top' : 'bottom';
        setPosition(newPosition);

        // Calculate horizontal position
        const buttonCenterX = buttonRect.left + buttonRect.width / 2;
        let leftOffset: number;

        if (buttonCenterX + dropdownWidth / 2 > viewportWidth) {
          // If dropdown would go off right edge, align it to the right edge of the button
          leftOffset = Math.min(viewportWidth - dropdownWidth, buttonRect.right - dropdownWidth);
        } else if (buttonCenterX - dropdownWidth / 2 < 0) {
          // If dropdown would go off left edge, align it to the left edge of the button
          leftOffset = Math.max(0, buttonRect.left);
        } else {
          // Center the dropdown under the button
          leftOffset = buttonCenterX - dropdownWidth / 2;
        }

        // Set the style based on position
        const newStyle: { left: string; [key: string]: string } = {
          left: `${leftOffset}px`,
        };

        // Add top or bottom position
        if (newPosition === 'top') {
          newStyle.bottom = `${viewportHeight - buttonRect.top}px`;
        } else {
          newStyle.top = `${buttonRect.bottom}px`;
        }

        setStyle(newStyle);
      }
    };

    // Check position after render
    setTimeout(checkPosition, 0);

    // Add resize listener
    window.addEventListener('resize', checkPosition);

    return () => {
      window.removeEventListener('resize', checkPosition);
    };
  }, [isOpen, buttonRef, minSpaceBelow, dropdownWidth]);

  return { position, style };
}