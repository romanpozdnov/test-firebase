import React, { memo } from 'react';
import { Card, Typography } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

import {
  calcIsDiscountEnded,
  calcDiscountTimeLeft,
  getFormattedPrice,
} from '../../helpers';

import { ROUTES } from '../../constants';

import styles from './product.module.css';

const { Meta } = Card;
const { Paragraph } = Typography;

export const Product = memo(
  ({
    productId,
    title,
    description,
    price,
    discount,
    discountEndTime,
    image,
    deleteProduct,
  }) => {
    const history = useHistory();

    const isDiscountEnded = calcIsDiscountEnded(discountEndTime);

    const { days, hours } = calcDiscountTimeLeft(discountEndTime);

    const handleEdit = () => {
      history.push(`${ROUTES.editProduct}/${productId}`, { state: { productId } });
    };

    const handleDelete = () => {
      deleteProduct(productId, image?.imageUrl);
    };

    return (
      <Card
        className={styles.card}
        cover={
          <div
            className={styles.cover}
            style={{ background: `url(${image?.imageUrl}) center/contain no-repeat` }}
          />
        }
        actions={[
          <EditOutlined key="edit" onClick={handleEdit} />,
          <DeleteOutlined key="delete" onClick={handleDelete} />,
        ]}
        bordered={false}
        hoverable
      >
        <Meta title={title} />
        <div className={styles.cardInner}>
          <div className={styles.priceWrapper}>
            {discount && (
              <div className={styles.oldPrice}>{getFormattedPrice(price)}</div>
            )}
            <div
              className={
                isDiscountEnded ? styles.currentPrice : styles.currentPriceWithDiscount
              }
            >
              {getFormattedPrice(
                isDiscountEnded ? price : price - (price * discount) / 100,
              )}
            </div>
          </div>
          <div className={styles.timeLeft}>
            {!isDiscountEnded &&
              `${days}d ${hours}h left
          `}
          </div>
        </div>
        <div className={styles.description}>
          <Paragraph ellipsis={{ rows: 2, expandable: true }}>{description}</Paragraph>
        </div>
      </Card>
    );
  },
);
