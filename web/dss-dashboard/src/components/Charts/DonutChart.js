import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NFormatterFun from '../common/numberFormaterFun';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import style from './styles';
import { isMobile } from 'react-device-detect';

const options = {
	responsive: true,
	options: {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			yAxes: [{
				ticks: {
					beginAtZero: true
				}
			}]
		}
	},
	legend: {
		display: true,
		position: 'bottom',
		labels: {
			boxWidth: 10
		}
	},
	tooltips: {
		callbacks: {
			label: function (tooltipItem, data) {
				var dataset = data.datasets[tooltipItem.datasetIndex];
				var meta = dataset._meta[Object.keys(dataset._meta)[0]];
				var total = meta.total;
				var currentValue = dataset.data[tooltipItem.index];
				var percentage = parseFloat((currentValue / total * 100).toFixed(1));
				// if (dataset.dataSymbol[tooltipItem.index][0] == 'number' || dataset.dataSymbol[tooltipItem.index][1] == 'Unit') {
				if (dataset.dataSymbol[tooltipItem.index][0] !== 'number') {
					currentValue = NFormatterFun(currentValue, dataset.dataSymbol[tooltipItem.index][0], dataset.dataSymbol[tooltipItem.index][1], true)
				}
				return currentValue + ' (' + percentage + '%)';
			},
			title: function (tooltipItem, data) {
				return data.labels[tooltipItem[0].index];
			}
		}
	}
};

class DonutChart extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			data: null
		}
	}
	getData(chartData) {
		var tempData = {
			labels: [],
			datasets: []
		};
		var tempdataSet = {
			label: "",
			backgroundColor: ["#35a2eb", "#f19c56", "#4c76c7", "#ff6384", '#FFC107', '#009688', '#9C27B0', '#4CAF50'],
			data: [],
			dataSymbol: []
		};

		_.map(chartData, function (k, v) {
			var plots = k['plots'];
			for (var i = 0; i < plots.length; i++) {
				tempData.labels.push(plots[i]['name']);
				// tempdataSet.data.push(NFormatterFun(plots[i]['value'], plots[i]['symbol'], this.props.GFilterData['Denomination']));
				tempdataSet.data.push(plots[i]['value'])
				tempdataSet.dataSymbol.push([plots[i]['symbol'], this.props.GFilterData['Denomination']]);
			}
		}.bind(this))
		tempData.datasets.push(tempdataSet);
		return tempData;
	}

	render() {
		let { chartData, classes } = this.props;
		let _data = this.getData(chartData)
		if (_data) {
			if (isMobile) {
				return (
					<div className={classes.piChart}>
						<Doughnut
							data={_data}
							height={350}
							options={options}
						/>
					</div>
				)
			} else {
				return (
					<div className={classes.piChart}>
						<Doughnut
							data={_data}
							options={options}
							height={200}
						/>
					</div>
				)
			}
		}
		return <div>Loading...</div>
	}
}

const mapStateToProps = (state) => {
	return {
		GFilterData: state.GFilterData,

	}
}
const mapDispatchToProps = dispatch => {
	return bindActionCreators({
	}, dispatch)
}
export default withStyles(style)(connect(mapStateToProps, mapDispatchToProps)(DonutChart));