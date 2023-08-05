import React, { useEffect, useRef } from 'react';
import { View, Text, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { apiThunk, apiPostThunk } from './apiThunk';

const MyComponent = () => {
  const dispatch = useDispatch();
  const { loading, data, error } = useSelector((state) => state.api);
const number = useRef(1);
  useEffect(() => {
    // Dispatch the apiThunk action when the component mounts
    // fetchData();
  }, []);

  const fetchData = () => {
    number.current = number.current + 1;
    // Dispatch the apiThunk action to fetch data
    dispatch(apiThunk(number.current));
  };
  const fetchDataPost = () => {
    dispatch(apiPostThunk(	{"name":"test","salary":"123","age":"23"}));
  };

  return (
    <View>
      <Button title="Fetch Data get" onPress={fetchData} />
      <Button title="Fetch Data post" onPress={fetchDataPost} />


      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>Error: {error}</Text>
      ) : (
        <Text>Data: {JSON.stringify(data)}</Text>
      )}
    </View>
  );
};

export default MyComponent;
