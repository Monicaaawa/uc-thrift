import React from 'react';
import { formatDistanceToNowStrict } from 'date-fns';

const TimeAgo = ({ timestamp }) => {
  let timeAgo;

  try {
    timeAgo = formatDistanceToNowStrict(new Date(timestamp), { addSuffix: true });
  } catch (error) {
    console.error('Error calculating relative time:', error);
    timeAgo = 'Unknown time';
  }

  return <span>{timeAgo}</span>;
};

export default TimeAgo;
