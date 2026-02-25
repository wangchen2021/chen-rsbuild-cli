import React from 'react';
import styles from './index.scss';

export interface MyButtonProps {
  text: string;
}

const MyButton: React.FC<MyButtonProps> = ({ text }) => {
  return <button className={styles.button}>{text}</button>;
};
export default MyButton;
