import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Submission } from "./../Models/Submission";
import { NaturesPaletteConfig } from "./../NaturesPaletteConfig";

@Injectable({
  providedIn: "root"
})
export class SubmissionService {
  config: NaturesPaletteConfig;
  uri: string;
  constructor(private http: HttpClient) {
    this.config = new NaturesPaletteConfig();
    this.uri = this.config.apiurl;
  }

  addSubmission(submission: Submission) {
    // const obj = {
    // };
    console.log(submission);

    this.http.post(`${this.uri}/submissions/add`, submission).subscribe(res => {
      console.log(res);
    });
  }

  uploadFilesForValidation(metadatafile: File, rawfile: File) {
    const metadataform: any = new FormData();
    metadataform.append("metadatafile", metadatafile, metadatafile.name);
    const rawfileform: any = new FormData();
    rawfileform.append("rawfile", rawfile, rawfile.name);
    // posting metadata file for validation

    this.http
      .post(`${this.uri}/metadata/validate`, metadataform)
      .subscribe(res => {
        console.log(res);
      });
    // console.log(rawfile);
    let rawfilePostRequest = this.http
      .post(`${this.uri}/rawfile/validate`, rawfileform)
      .subscribe(
        res => {
          console.log("uploading Raw Files");
        },
        err => console.error(err),
        () => {
          console.log("observable complete");
        }
      );
    return 'Success';
  }

  validateFiles(metadatafile: File, rawfile: File) {
    // console.log(metadatafile);
    let fileConsistencyValidated = false;

    //console.log(rawfilePostRequest);
    const validationform: any = new FormData();
    validationform.append("rawfilename", rawfile.name);
    validationform.append("metadatafilename", metadatafile.name);

    return this.http.post(
      `${this.uri}/validation/primaryvalidation`,
      validationform
    );
  }
}
