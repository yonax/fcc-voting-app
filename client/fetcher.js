import React, { Component } from 'react';
import { Loading, Errors } from './components';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const fetcher = (propsToRequest, dataname='data') => WrappedComponent => {
  return class Fetcher extends Component {
      static displayName = `Fetcher(${getDisplayName(WrappedComponent)})`

      constructor(props) {
        super(props);
        this.state = {
          isFetching: true
        }
      }
      componentDidMount() {
        this.fetchData();
      }
      fetchData() {
        this.setState({ isFetching: true, error: null });
        propsToRequest(this.props).then(
          data => this.setState({ data, isFetching: false }),
          error => this.setState({ error, isFetching: false })
        )
      }
      render() {
        const { isFetching, error, data } = this.state;
        if (error) {
          return (
            <div>
              <Errors error={error} />
              <button onClick={::this.fetchData}>Retry</button>
            </div>
          );
        }
        if (isFetching) {
          return <Loading />
        }
        return React.createElement(
          WrappedComponent,
          Object.assign({}, this.props, { [dataname]: data }),
        );
      }
  }
};

export default fetcher;
