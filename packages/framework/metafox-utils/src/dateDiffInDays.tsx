import moment from 'moment';

const dateDiffInDays = (date1: string, date2?: string) => {
  const newDate = moment(date2 || moment(new Date()).format('YYYY-MM-DD')).set({
    year: 0
  });
  const endDate = moment(moment(new Date(date1)).format('YYYY-MM-DD')).set({
    year: 0
  });

  return endDate.diff(newDate, 'days');
};

export default dateDiffInDays;
