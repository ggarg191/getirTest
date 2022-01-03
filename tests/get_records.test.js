const axios = require('axios');

const apiCall = (json) => {
    return new Promise((resolve, reject) => {
        axios.post('http://localhost:3000/get_record', json, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err)
            });
    })
}

test('should return error code 2 when empty json is passed', async() => {
    var res = await apiCall({});
    expect(res.data.code).toBe(2);
})

test('should return error code 2 when incorrect json is passed', async() => {
    var testcase_json = {
        "startDate": "2016-01-01",
        "minCount": 2700,
        "maxCount": 3000
    }
    var res = await apiCall(testcase_json);
    expect(res.data.code).toBe(2);
})

test('should return  code 0 when correct json is passed', async() => {
    var testcase_json = {
        "startDate": "2016-01-01",
        "endDate": "2018-02-02",
        "minCount": 2700,
        "maxCount": 3000
    }
    var res = await apiCall(testcase_json);
    expect(res.data.code).toBe(0);
})

test('Data Validation test case', async() => {
    var testcase_json = {
        "startDate": "2016-01-01",
        "endDate": "2018-02-02",
        "minCount": 2700,
        "maxCount": 3000
    }
    var res = await apiCall(testcase_json);
    res.data.records.forEach((record) => {
        expect(record.totalCount).toBeLessThanOrEqual(testcase_json.maxCount);
        expect(record.totalCount).toBeGreaterThanOrEqual(testcase_json.minCount);
        expect(record.createdAt).toBeGreaterThanOrEqual(new Date(testcase_json.startDate));
        expect(record.createdAt).toBeLessThanOrEqual(new Date(testcase_json.endDate));
    });
})