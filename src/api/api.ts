export interface CourseScheduleJSON {
    /** 节次代码 example: '01,02' */
    jcdm2: string, 
    /** 教学班名称 */
    jxbmc: string,
    /** 教学场地名称 */
    jxcdmcs: string,
    /** 课程编号 */
    kcbh: string,
    /** 课程名称 */
    kcmc: string,
    /** 课程任务代码 */
    kcrwdm: string,
    /** 教师姓名 */
    teaxms: string,
    /** 星期 */
    xq: string,
    /** 周次 */
    zcs: string,
}

export async function jxfwLogin(jxfwTokenURL: string | URL | Request): Promise<HeadersInit> {
    const jxfwLoginResponse = await fetch(jxfwTokenURL, {
        redirect: 'manual',
    })
    const jxfwHeaders: HeadersInit = {
        'Cookie': jxfwLoginResponse.headers.get('Set-Cookie')!,
        'Referer': 'https://jxfw.gdut.edu.cn/',
    }
    const jxfwssoLoginResp = await fetch(jxfwLoginResponse.headers.get('Location')!.replace("http://", "https://"), {
        headers: jxfwHeaders,
        redirect: 'manual',
    })
    if (jxfwssoLoginResp.headers.get('Location') !== 'https://jxfw.gdut.edu.cn/login!welcome.action') {
        console.log('Warning: JXFW login not redirect to main page', jxfwssoLoginResp.headers.get('Location'));
    }
    return jxfwHeaders
}

/**
 * 学生个人学期课表 API
 * @param xnxqdm 学年学期代码
 */
export async function xsAllKbList(jxfwHeaders: HeadersInit, xnxqdm: string | number): Promise<CourseScheduleJSON[]> {
    const htmlPage = await (await fetch('/xsgrkbcx!xsAllKbList.action?xnxqdm=' + xnxqdm.toString(), {
        headers: jxfwHeaders,
    })).text()
    return JSON.parse(htmlPage.match(/var kbxx = (\[.*?]);/)![1])
}

/**
 * 学生按周课表 API
 * @param jxfwHeaders JXFW 登录后的 headers
 * @param zc 周次
 * @param xnxqdm 学年学期代码
 */
export async function getKbRq(jxfwHeaders: HeadersInit, zc: string | number, xnxqdm: string | number) {
    return await (await fetch(`/xsgrkbcx!getKbRq.action?zc=${zc}&xnxqdm=${xnxqdm}`, {
        headers: jxfwHeaders,
    })).json()
}

/**
 * @param jxfwHeaders JXFW 登录后的 headers
 * @param xnxqdm 学年学期代码
 * @returns 该学期的第一天
 */
export async function getFirstDayInSemester(jxfwHeaders: HeadersInit, xnxqdm: string | number) {
    const firstWeekDay = (await getKbRq(jxfwHeaders, '1', xnxqdm))[1] as Array<{xqmc: string, rq: string}>;
    return new Date(firstWeekDay.find((day) => day.xqmc === "1")!.rq)
}

export async function getXzkcList(jxfwHeaders: HeadersInit) {
    return await (await fetch("/xsxklist!getXzkcList.action", {
        "headers": jxfwHeaders,
        "body": "sort=kcrwdm&order=asc",
        "method": "POST",
    })).json();
}

export async function getAdd(jxfwHeaders: HeadersInit, kcrwdm: string | number, kcmc: string) {
    return await (await fetch("/xsxklist!getAdd.action", {
        "headers": jxfwHeaders,
        "body": `kcrwdm=${kcrwdm}&kcmc=${kcmc}`,
        "method": "POST",
    })).text()
}
