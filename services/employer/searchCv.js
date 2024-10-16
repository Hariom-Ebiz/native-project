import { axiosInstance } from "../../api";

export const getSearchCvs = async () => {
  let res;

  try {
    res = await axiosInstance.get(`job-seeker-cv/employer/search`);
  } catch (err) {
    console.log("error", err);
    return {
      jobCv: []
    };
  }
  return {
    jobCv: res?.data?.list?.data || [],
  }
}

export const inviteCnadidateMailTemplate = {subject: "{ORG} invites you to apply for a {JOB_TITLE} vacancy.", body: `<table border="0" cellpadding="0" cellspacing="0" data-module="header-white" role="presentation" width="100%">
<tbody>
  <tr>
    <td align="center" class="o_bg-light o_px-xs o_pt-lg o_xs-pt-xs" data-bgcolor="Bg Light" style="background-color: rgb(241, 241, 241); padding-left: 8px; padding-right: 8px; padding-top: 32px;">
    <table border="0" cellpadding="0" cellspacing="0" class="o_block" role="presentation" style="max-width: 632px; margin: 0px auto; height: 39px;" width="100%">
      <tbody>
        <tr>
          <td align="center" class="o_bg-white o_px o_py-md o_br-t o_sans o_text" data-bgcolor="Bg White" data-max="20" data-min="12" data-size="Text Default" style="font-family: Helvetica, Arial, sans-serif; margin-top: 0px; margin-bottom: 0px; font-size: 16px; line-height: 24px; background-color: rgb(165 206 255); border-radius: 4px 4px 0px 0px; padding: 15px 16px;">
          <p style="margin-top: 0px; margin-bottom: 0px; color: rgb(147, 172, 109);"><a class="o_text-primary" data-color="White" href="https://nativessr.stage04.obdemo.com" style="color: rgb(18, 109, 229); text-decoration-line: none; outline: none;"><img alt="" data-crop="false" src="https://nativens.stage04.obdemo.com/assets/logo.png" style="border-width: 0px; border-style: initial; outline: none; max-width: 100%; vertical-align: middle; line-height: 16px; max-height: 100%; height: 35px; width: 100px;" /></a></p>
          </td>
        </tr>
      </tbody>
    </table>
    </td>
  </tr>
</tbody>
</table>

<table border="0" cellpadding="0" cellspacing="0" data-module="content-lg-left" role="presentation" width="100%">
<tbody>
  <tr>
    <td align="center" class="o_bg-light o_px-xs" data-bgcolor="Bg Light" style="background-color: rgb(241, 241, 241); padding-left: 8px; padding-right: 8px;">
    <table border="0" cellpadding="0" cellspacing="0" class="o_block" role="presentation" style="max-width: 632px; margin: 0px auto; height: 106px;" width="100%">
      <tbody>
        <tr>
          <td align="left" class="o_bg-white o_px-md o_py o_sans o_text o_text-secondary" data-bgcolor="Bg White" data-color="Secondary" data-max="20" data-min="12" data-size="Text Default" style="margin-top: 0px; margin-bottom: 0px; line-height: 24px; background-color: rgb(255, 255, 255); padding: 30px 24px 16px;">
              
<div>
  <p>Hi {NAME}</p>
  <p>
      I came across your profile on <span style="color: blue">Native</span> and would like to invites you to apply for the {JOB_TITLE} vacancy we currently have open. Your profile seems like a good match for what we are looking for. <br />
  </p>
  <p>
      If you're interested in learning more about this vacancy, check out the job posting.
  </p>
</div>
          </td>
        </tr>
      </tbody>
    </table>
    </td>
  </tr>
</tbody>
</table>

<table border="0" cellpadding="0" cellspacing="0" data-module="footer-white" role="presentation" width="100%">
<tbody>
  <tr>
    <td align="center" class="o_bg-light o_px-xs o_pb-lg o_xs-pb-xs" data-bgcolor="Bg Light" style="background-color: rgb(241, 241, 241); padding-left: 8px; padding-right: 8px; padding-bottom: 32px;">
    <table border="0" cellpadding="0" cellspacing="0" class="o_block" role="presentation" style="max-width: 632px; margin: 0px auto;" width="100%">
      <tbody>
        <tr>
          <td align="center" class="o_bg-white o_px-md o_py-lg o_bt-light o_br-b o_sans o_text-xs o_text-light" data-bgcolor="Bg White" data-border-top-color="Border Light" data-color="Light" data-max="18" data-min="10" data-size="Text XS" style="border-top-style: solid; border-top-color: rgb(211, 220, 224); margin-top: 0px; margin-bottom: 0px; font-size: 14px; line-height: 21px; background-color: rgb(224, 224, 224); border-radius: 0px 0px 4px 4px; padding: 15px 24px;">
          <p class="o_mb" style="margin-top: 0px; margin-bottom: 0px; font-size: 13px;"><font color="#333333" face="sans-serif, Arial, Verdana, Trebuchet MS" style="color: rgb(85, 85, 85); font-family: Helvetica, Arial, sans-serif;">&copy; Copyright </font><font color="#555555" face="Helvetica, Arial, sans-serif" style="">Native</font><font color="#333333" face="sans-serif, Arial, Verdana, Trebuchet MS" style="color: rgb(85, 85, 85); font-family: Helvetica, Arial, sans-serif;">&nbsp;| All Right Reserved 2023</font></p>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="o_hide-xs" style="font-size: 64px; line-height: 64px; height: 64px;"><span style="font-size: 13px;">&nbsp;&nbsp;</span></div>
    </td>
  </tr>
</tbody>
</table>`};

export const getJobTypes = async () => {
  let res;

  try {
    res = await axiosInstance.get("job-seeker-cv/job-types-filter");
  } catch (err) {
    return [];
  }

  return res?.data?.list;
}

export const getJobCategories = async () => {
  let res;

  try {
    res = await axiosInstance.get("job-seeker-cv/job-category-filter");
  } catch (err) {
    return [];
  }

  return res?.data?.list;
}

export const getJobSalaryRange = async () => {
  let res;

  try {
    res = await axiosInstance.get("job-seeker-cv/salary-range-filter");
  } catch (err) {
    return [];
  }

  return res?.data?.list;
}