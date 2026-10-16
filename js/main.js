/**
 * DHANANJAY SHARMA — PORTFOLIO MAIN ENTRYPOINT
 * Coordinates animation and interaction subsystems
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Log portfolio environment details for debugging
  console.log(
    '%c Dhananjay Sharma — Editorial Portfolio %c Ready ',
    'background: #1F211D; color: #F4F2EC; font-weight: bold; padding: 4px 8px; border-radius: 2px 0 0 2px;',
    'background: #57654C; color: #FFFFFF; font-weight: bold; padding: 4px 8px; border-radius: 0 2px 2px 0;'
  );

  // Initialize animations
  if (window.PortfolioAnimations && typeof window.PortfolioAnimations.init === 'function') {
    try {
      window.PortfolioAnimations.init();
    } catch (e) {
      console.error('Error initializing animation system:', e);
    }
  }

  // Initialize interactions
  if (window.PortfolioInteractions && typeof window.PortfolioInteractions.init === 'function') {
    try {
      window.PortfolioInteractions.init();
    } catch (e) {
      console.error('Error initializing interaction system:', e);
    }
  }
});
