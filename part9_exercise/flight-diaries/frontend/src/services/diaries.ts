import axios from "axios";
import {DiaryEntry,NewDiaryEntry} from "../../../backend/src/types";
const baseUrl = 'http://localhost:3000/api/diaries';

const getAllDiaries=()=>{
    return axios.get<DiaryEntry[]>(baseUrl).then(response=>response.data)
}

const addDiary=(object:NewDiaryEntry)=>{
    return axios.post<DiaryEntry>(baseUrl,object).then(response=>response.data)
}

export default{getAllDiaries,addDiary}