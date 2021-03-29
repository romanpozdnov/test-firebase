import moment from 'moment';
import 'moment-duration-format';

const getUnixDiff = (date) => {
  const now = moment().unix();
  return date - now;
};

export const calcIsDiscountEnded = (date) => {
  const diff = date ? getUnixDiff(date) : -1;
  return diff < 0;
};

export const calcDiscountTimeLeft = (date) => {
  const duration = moment.duration(getUnixDiff(date), 'seconds');
  const days = duration.days();
  const hours = duration.hours();
  return {
    days,
    hours,
  };
};

export const getFormattedPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const getImageDimensions = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', (event) => {
      const loadedImageUrl = event.target.result;
      const image = document.createElement('img');
      image.src = loadedImageUrl;
      image.addEventListener('load', () => {
        const { width, height } = image;
        resolve({ width, height });
      });
    });
  });
};

export const formatterPrice = (value) => {
  return value && `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const parsePrice = (value) => value.replace(/\$\s?|(,*)/g, '');

export const formatterDiscount = (value) => value && `${value}%`;

export const parserDiscount = (value) => value.replace('%', '');
