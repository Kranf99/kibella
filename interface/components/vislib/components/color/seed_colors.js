define(function () {
  /*
   * Using a random color generator presented awful colors and unpredictable color schemes.
   * So we needed to come up with a color scheme of our own that creates consistent, pleasing color patterns.
   * The order allows us to guarantee that 1st, 2nd, 3rd, etc values always get the same color.
   * Returns an array of 72 colors.
   */

  return function SeedColorUtilService() {
    return [
      '#D473FF',
      '#765de0',
      '#7091ff',
      '#8ed8f3',
      '#bc52bc',
      '#e83e6f',
      '#daa05d',
      '#f14b4b',
      '#ff67f5'
    ];
  };
});
