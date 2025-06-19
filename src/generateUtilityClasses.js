// const fs = require('fs');
import fs from 'fs';

const variants = [
	'primary',
	'secondary',
	'accent',
	'warning',
	'error',
	'success',
	'info',
	'disabled'
];

let output = `@layer components {
`;

variants.forEach((variant) => {
	const colorVar = `--color-${variant}`;

	// Base button variant
	output += `
.btn--${variant} {
  background-color: var(${colorVar}-500);
  border-color: var(${colorVar}-500);
  color: var(--color-white);
}
.btn--${variant}:hover {
  @media (hover: hover) {
    background-color: var(${colorVar}-800);
    border-color: var(${colorVar}-800);
  }
}
`;

	// Outline button variant
	output += `
.btn-outline--${variant} {
  background-color: transparent;
  color: var(${colorVar}-500);
  border-color: var(${colorVar}-500);
}
.btn-outline--${variant}:hover {
  @media (hover: hover) {
    background-color: var(${colorVar}-200);
  }
}
`;

	// Text button variant
	output += `
.btn-text--${variant} {
  background-color: transparent;
  border-color: transparent;
  color: var(${colorVar}-500);
}
.btn-text--${variant}:hover {
  @media (hover: hover) {
    background-color: var(${colorVar}-200);
  }
}
`;

	// Disabled overrides
	if (variant === 'disabled') {
		output += `
.btn--disabled,
.btn-outline--disabled,
.btn-text--disabled {
  cursor: not-allowed;
  pointer-events: none;
}
`;
	}
});

output += `
}
`;

fs.writeFileSync('button-variants.css', output);
console.log('✅ Generated: button-variants.css');
