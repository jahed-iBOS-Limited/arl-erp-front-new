export const redirectToIbosRegister = () => {
  const origin = window.location.origin;
  const rootUrl =
    import.meta.env.MODE === 'development'
      ? 'http://localhost:8000'
      : origin === 'https://deverp.ibos.io'
      ? 'https://deverpreg.ibos.io'
      : 'https://register.ibos.io/';

  window.open(rootUrl, '_blank');
};
