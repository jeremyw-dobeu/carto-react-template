import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setBottomSheetOpen, setError } from 'store/appSlice';
import {
  Divider,
  Grid,
  Typography,
  makeStyles,
  // Box
} from '@material-ui/core';
import { AggregationTypes } from '@carto/react-core';
import {
  FormulaWidget,
  CategoryWidget,
  HistogramWidget,
  ScatterPlotWidget,
} from '@carto/react-widgets';
import { currencyFormatter, intervalsFormatter } from 'utils/formatter';
import storesSource from 'data/sources/storesSource';

const useStyles = makeStyles((theme) => ({
  title: {
    padding: theme.spacing(3, 3, 1.5),
  },
}));

function StoresList() {
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setBottomSheetOpen(false));
  }, [dispatch]);

  // [hygen] Add useEffect

  const onTotalRevenueWidgetError = (error) => {
    dispatch(setError(`Error obtaining total revenue: ${error.message}`));
  };

  const onRevenuePerTypeWidgetError = (error) => {
    dispatch(setError(`Error obtaining revenue per type: ${error.message}`));
  };

  const onStoresByRevenueWidgetError = (error) => {
    dispatch(setError(`Error obtaining stores per revenue: ${error.message}`));
  };

  const onRevenueBySizeWidgetError = (error) => {
    dispatch(setError(`Error obtaining revenue per size: ${error.message}`));
  };

  return (
    <Grid item xs>
      <Typography variant='h5' gutterBottom className={classes.title}>
        Store Analysis
      </Typography>

      <Divider />

      <FormulaWidget
        id='totalRevenue'
        title='Total revenue'
        dataSource={storesSource.id}
        column='revenue'
        operation={AggregationTypes.SUM}
        formatter={currencyFormatter}
        onError={onTotalRevenueWidgetError}
      />

      <Divider />

      <CategoryWidget
        id='revenueByStoreType'
        title='Revenue by store type'
        dataSource={storesSource.id}
        column='storetype'
        operationColumn='revenue'
        operation={AggregationTypes.SUM}
        formatter={currencyFormatter}
        onError={onRevenuePerTypeWidgetError}
      />

      <Divider />

      <HistogramWidget
        id='storesByRevenue'
        title='Stores by revenue'
        dataSource={storesSource.id}
        formatter={intervalsFormatter}
        xAxisFormatter={currencyFormatter}
        operation={AggregationTypes.COUNT}
        column='revenue'
        min={1000000}
        max={2000000}
        onError={onStoresByRevenueWidgetError}
      />

      <Divider />

      <ScatterPlotWidget
        id='revenueBySize'
        title='Revenue by size (m2 | $)'
        dataSource={storesSource.id}
        xAxisColumn='size_m2'
        xAxisFormatter={(v) => `${v} m2`}
        yAxisColumn='revenue'
        yAxisFormatter={currencyFormatter}
        tooltipFormatter={(v) => `${v.value[0]} m2 | ${v.value[1]} $`}
        onError={onRevenueBySizeWidgetError}
      />
      <Divider />
    </Grid>
  );
}

export default StoresList;
