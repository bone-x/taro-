export default {
  //荣誉勋章接口
  getHonourInfo: {
    url: 'learningCenter/app/listHonorMedal',
    interFaceType: 'live',
    hasToken: 'SSOTOKEN',
    header: {
      'Content-Type': 'application/json'
    },
    method: 'GET'
  }
};
