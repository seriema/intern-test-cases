#Main issue:

## Directly after `intern init`

Running `intern run` gives this result, even though the paths in the config are wrong:

```
$ intern run
PASS: hello - hello world (0ms)
0/1 tests failed
0/1 tests failed
```

The paths according to the config:

```
suites: [ 'app/tests/unit/*' ],
functionalSuites: [ /* 'app/tests/functional' */ ],
```

The paths on disk (note the lack of `app/`):

```
tests/unit/
tests/functional/
```

**Expected:** No tests should be found because the `suites` is wrong, and `functionalSuites` is commented out. 

## Commenting out the `functionalSuites`

Test running the functional tests with `intern run -w` gives this error:

```
$ intern run -w
Listening on 0.0.0.0:9000
Error: Failed to load module app/tests/functional from C:/Users/jojoh/Documents/GitHub/intern-test-cases/plain-init/tests/functional.js (parent: *27)
  at ReadFileContext.callback  <node_modules\dojo\loader.ts:831:119>
  at FSReqWrap.readFileAfterOpen [as oncomplete]  <fs.js:325:13>
```

**Expected:** The tests in `tests/functional` should run.

## Fixing the `functionalSuites` path

Using `SeleniumTunnel` and setting `functionalSuites` to:

```
functionalSuites: [ 'tests/functional/*' ],
```

Gives this error:

```
$ intern run -w
  
  Listening on 0.0.0.0:9000
  Tunnel started
  ‣ Created session chrome on any platform (a2d5ae4f-19fe-40e6-b79c-ef0e04830ec2)
  ✓ chrome on any platform - unit tests - hello - hello world (0.001s)
  × chrome on any platform - hello - check contents (0.545s)
  NoSuchElement: [POST http://localhost:4444/wd/hub/session/a2d5ae4f-19fe-40e6-b79c-ef0e04830ec2/element / {"using":"class name","value":"bar"}] no such element: Unable to locate element: {"method":"class name","selector":"bar"}
    (Session info: chrome=52.0.2743.116)
    (Driver info: chromedriver=2.22.397933 (1cab651507b88dec79b2b2a22d1943c01833cc1b),platform=Windows NT 10.0.14901 x86_64) (WARNING: The server did not provide any stacktrace information)
  Command duration or timeout: 13 milliseconds
  For documentation on this error, please visit: http://seleniumhq.org/exceptions/no_such_element.html
  Build info: version: '2.53.1', revision: 'a36b8b1', time: '2016-06-30 17:37:03'
  System info: host: 'EPSEBCJOJOH', ip: '10.99.11.87', os.name: 'Windows 8.1', os.arch: 'amd64', os.version: '6.3', java.version: '1.7.0_79'
  *** Element info: {Using=class name, value=bar}
  Session ID: 6e3cbe737bd88e9fb9dde4a64bf28a84
  Driver info: org.openqa.selenium.chrome.ChromeDriver
  Capabilities [{platform=WIN8_1, acceptSslCerts=true, javascriptEnabled=true, browserName=chrome, chrome={userDataDir=C:\Users\jojoh\AppData\Local\Temp\scoped_dir5668_12836, chromedriverVersion=2.22.397933 (1cab651507b88dec79b2b2a22d1943c01833cc1b)}, rotatable=false, locationContextEnabled=true, mobileEmulationEnabled=false, version=52.0.2743.116, takesHeapSnapshot=true, cssSelectorsEnabled=true, databaseEnabled=false, handlesAlerts=true, browserConnectionEnabled=false, webStorageEnabled=true, nativeEvents=true, hasTouchScreen=false, applicationCacheEnabled=false, takesScreenshot=true}]
    at runRequest  <node_modules\leadfoot\Session.js:88:40>
    at <node_modules\leadfoot\Session.js:109:39>
    at new Promise  <node_modules\dojo\Promise.ts:411:3>
    at ProxiedSession._post  <node_modules\leadfoot\Session.js:63:10>
    at ProxiedSession.Session.find  <node_modules\leadfoot\Session.js:1227:15>
    at Command.<anonymous>  <node_modules\leadfoot\Command.js:42:36>
    at <node_modules\dojo\Promise.ts:393:15>
    at run  <node_modules\dojo\Promise.ts:237:7>
    at <node_modules\dojo\nextTick.ts:44:3>
    at nextTickCallbackWith0Args  <node.js:433:9>
    at Command.find  <node_modules\leadfoot\Command.js:23:10>
    at Command.prototype.(anonymous function) [as findByClassName]  <node_modules\leadfoot\lib\strategies.js:24:16>
    at Test.registerSuite.check contents [as test]  <tests\functional\hello.js:18:6>
    at <node_modules\intern\lib\Test.js:181:24>
    at <node_modules\intern\browser_modules\dojo\Promise.ts:393:15>
    at runCallbacks  <node_modules\intern\browser_modules\dojo\Promise.ts:11:11>
    at <node_modules\intern\browser_modules\dojo\Promise.ts:317:4>
    at run  <node_modules\intern\browser_modules\dojo\Promise.ts:237:7>
    at <node_modules\intern\browser_modules\dojo\nextTick.ts:44:3>
    at nextTickCallbackWith0Args  <node.js:433:9>
  No unit test coverage for chrome on any platform
  chrome on any platform: 1/2 tests failed
  
  
  TOTAL: tested 1 platforms, 1/2 tests failed
```

**Expected:** The tests should pass (unless it's an intentional fail to show how it works).

## Fixing the functional test page

Just write the element in the HTML instead of generating it from JS with a timeout of 1sec. The element won't be available otherwise.

Before:

```
<script>
    setTimeout(function () {
        var div = document.createElement('div');
        div.innerHTML = 'Foo';
        div.className = 'bar';
        document.body.appendChild(div);
    }, 1000);
</script>
```

After:

```
<div class="bar">Foo</div>
```

Gives the expected output:

```
$ intern run -w
Listening on 0.0.0.0:9000
Tunnel started
‣ Created session chrome on any platform (af64bf7c-4290-4701-b1fc-d92b9bab03bf)
✓ chrome on any platform - unit tests - hello - hello world (0.001s)
✓ chrome on any platform - hello - check contents (0.066s)
No unit test coverage for chrome on any platform
chrome on any platform: 0/2 tests failed


TOTAL: tested 1 platforms, 0/2 tests failed
```
