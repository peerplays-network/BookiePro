//unused
import React from 'react';
import {connect} from 'react-redux';
import {curry, flow, pairs} from 'lodash';
import ChainTypes from '../Utility/ChainTypes';
import Repository from 'repositories/chain/repository';

const checkChainType = curry( (chain_type, t) => t === chain_type || t === chain_type.isRequired );
const arrayElement = (element_number, array) => array[element_number];
const firstEl = curry(arrayElement)(0);
const secondEl = curry(arrayElement)(1);
const isAssetType = checkChainType(ChainTypes.ChainAsset);

export function connectComponentWrapper(Component, mapStateToProps) {
  class ConnectComponentWrapper extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        dataIsFetched: false
      };

      this.newProps = {};
      let prop_types_array = pairs(Component.propTypes);
      this.assets = prop_types_array.filter(flow(secondEl, isAssetType)).map(firstEl);
      console.log('mapStateToPropsmapStateToPropsmapStateToProps', mapStateToProps);
    }

    componentWillMount() {
      let assetsPromises = [];

      this.assets.forEach((assetVarName) => {
        if (this.props[assetVarName]) {
          assetsPromises.push(Repository.getObject(this.props[assetVarName]));
        }

        console.log('assetVarName', assetVarName, this.props[assetVarName], this.props);
      });

      Promise.all(assetsPromises).then((assets) => {
        console.log('assets', assets);
        assets.forEach((asset) => {
          this.newProps.asset = asset;
        });

        this.setState({
          dataIsFetched: true
        });
      });
    }

    check() {}

    componentWillReceiveProps() {
      this.check();
    }

    render() {
      const props = {
        ...this.props,
        ...this.newProps
      };

      return this.state.dataIsFetched ? <Component { ...props } /> : <span>Fetching...</span>;
    }
  }

  return connect(mapStateToProps)(ConnectComponentWrapper);
}