import clone from 'lodash/clone';
import isString from 'lodash/isString';
import isBoolean from 'lodash/isBoolean';
import isObject from 'lodash/isObject';
import throttle from 'lodash/throttle';
import isFunction from 'lodash/isFunction';
import { EventEmitter } from 'eventemitter3';
import { v4 as uuid } from 'uuid';

const isSafari = false; // /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const _getUser = () => {
  const result = {
    user() {
      return null;
    },
    userId: null,
  };
  if (isFunction(this.config.Meteor.userId)) {
    result.user = () => this.config.Meteor.user();
    result.userId = this.config.Meteor.userId();
  }
  return result;
};

const _getExt = (fileName) => {
  if (fileName.indexOf('.') >= 0) {
    const extension = (
      fileName.split('.').pop().split('?')[0] || ''
    ).toLowerCase();
    return { ext: extension, extension, extensionWithDot: `.${extension}` };
  }
  return { ext: '', extension: '', extensionWithDot: '' };
};

const _getMimeType = (fileData) => {
  let mime;
  if (isObject(fileData)) {
    mime = fileData.type;
  }

  if (!mime || !isString(mime)) {
    mime = 'application/octet-stream';
  }
  return mime;
};

/*
 * @locus Client
 * @name FileUpload
 * @class FileUpload
 * @summary Internal Class, instance of this class is returned from `.insert()` method
 */
export class FileUpload extends EventEmitter {
  constructor(config) {
    super();
    this.config = config;

    if (!this.config.isBase64) {
      this.file = { ...clone(this.config.file), ...this.config.fileData };
    } else {
      this.file = this.config.fileData;
    }
    this.state = 'active';
    this.onPause = false;
    this.progress = 0;
    this.continueFunc = () => {};
    this.estimateTime = 1000;
    this.estimateSpeed = 0;
    this.estimateTimer = setInterval(() => {
      if (this.state === 'active') {
        const _currentTime = this.estimateTime;
        if (_currentTime > 1000) {
          this.estimateTime = _currentTime - 1000;
        }
      }
    }, 1000);
  }

  pause() {
    if (!this.onPause) {
      this.onPause = true;
      this.state = 'paused';
      this.emit('pause', this.file);
    }
  }

  continue() {
    if (this.onPause) {
      this.onPause = false;
      this.state = 'active';
      this.emit('continue', this.file);
      this.continueFunc();
    }
  }

  toggle() {
    if (this.onPause) {
      this.continue();
    } else {
      this.pause();
    }
  }

  abort() {
    // window.removeEventListener('beforeunload', this.config.beforeunload, false);
    if (this.config.onAbort) {
      this.config.onAbort.call(this, this.file);
    }
    this.emit('abort', this.file);
    this.pause();
    this.config._onEnd();
    this.state = 'aborted';
    this.config.ddp.callAsync(this.config._Abort, this.config.fileId);
  }
}

/*
 * @locus Client
 * @name UploadInstance
 * @class UploadInstance
 * @summary Internal Class, used for file upload
 */
export class UploadInstance extends EventEmitter {
  constructor(config) {
    super();
    this.config = config;
    this.config.streams = 'dynamic';
    this.config.transport = 'ddp';
    this.config.ddp = this.config.Meteor.ddp;
    this.config.chunkSize = 'dynamic';
    this.config.allowWebWorkers = false;

    if (!this.config.meta) {
      this.config.meta = {};
    }

    if (!this.config.streams) {
      this.config.streams = 2;
    }

    if (this.config.streams < 1) {
      this.config.streams = 2;
    }

    this.config.transport = 'ddp';

    // if (!this.config.chunkSize) {
    //   this.config.chunkSize = this.collection.chunkSize;
    // }

    if (!isBoolean(this.config.allowWebWorkers)) {
      this.config.allowWebWorkers = true;
    }

    // check(this.config, {
    //   ddp: Match.Any,
    //   file: Match.Any,
    //   fileId: Match.Optional(String),
    //   meta: Match.Optional(Object),
    //   type: Match.Optional(String),
    //   onError: Match.Optional(Function),
    //   onAbort: Match.Optional(Function),
    //   streams: Match.OneOf('dynamic', Number),
    //   onStart: Match.Optional(Function),
    //   fileName: Match.Optional(String),
    //   isBase64: Match.Optional(Boolean),
    //   transport: Match.OneOf('http', 'ddp'),
    //   chunkSize: Match.OneOf('dynamic', Number),
    //   onUploaded: Match.Optional(Function),
    //   onProgress: Match.Optional(Function),
    //   onBeforeUpload: Match.Optional(Function),
    //   allowWebWorkers: Boolean,
    // });

    if (this.config.isBase64 === true) {
      if (!this.config.fileName) {
        throw new Error(400, '"fileName" must me specified for base64 upload!');
      }

      if (this.config.file.indexOf('data:') >= 0) {
        this.config.file = this.config.file.replace('data:', '');
      }

      if (this.config.file.indexOf(',') >= 0) {
        const _file = this.config.file.split(',');
        this.fileData = {
          size: Math.floor((_file[1].replace(/=/g, '').length / 4) * 3),
          type: _file[0].split(';')[0],
          name: this.config.fileName,
          meta: this.config.meta,
        };
        [, this.config.file] = _file;
      } else if (!this.config.type) {
        throw new Error(
          400,
          '"type" must me specified for base64 upload! And represent mime-type of the file',
        );
      } else {
        this.fileData = {
          size: Math.floor((this.config.file.replace(/=/g, '').length / 4) * 3),
          type: this.config.type,
          name: this.config.fileName,
          meta: this.config.meta,
        };
      }
    }

    if (this.config.file) {
      if (!this.config.isBase64) {
        try {
          if (!this.config.fileName || !this.config.fileSize) {
            throw new Error(500, 'Not a File!');
          }
        } catch (e) {
          throw new Error(
            500,
            '[FilesCollection] [insert] Insert method accepts File, not a FileList. You need to provide a real File. File must have `.name` property, and its size must be larger than zero.',
          );
        }

        this.fileData = {
          size: this.config.fileSize,
          type: this.config.type || this.config.file.type,
          name: this.config.fileName || this.config.file.name,
          meta: this.config.meta,
        };
      }

      this.worker = null;

      this.startTime = {};
      this.currentChunk = 0;
      this.transferTime = 0;
      this.trackerComp = null;
      this.sentChunks = 0;
      this.fileLength = 1;
      this.EOFsent = false;
      this.pipes = [];

      this.fileId = this.config.fileId || uuid();
      this.FSName = this.fileId;

      this.fileData = Object.assign(
        this.fileData,
        _getExt(this.fileData.name),
        { mime: _getMimeType(this.fileData) },
      );
      this.fileData['mime-type'] = this.fileData.mime;

      this.result = new FileUpload({
        ...this.config,
        fileData: this.fileData,
        fileId: this.fileId,
        _Abort: '_FilesCollectionAbort_attachments',
      });

      this.beforeunload = (e) => {
        const message = 'Upload in a progress... Do you want to abort?';
        if (e) {
          e.returnValue = message;
        }
        return message;
      };

      this.result.config.beforeunload = this.beforeunload;
      // window.addEventListener('beforeunload', this.beforeunload, false);

      this.result.config._onEnd = () => this.emit('_onEnd');

      this.addListener('end', this.end);
      this.addListener('start', this.start);
      this.addListener('upload', this.upload);
      this.addListener('sendEOF', this.sendEOF);
      this.addListener('prepare', this.prepare);
      this.addListener('sendChunk', this.sendChunk);
      this.addListener('proceedChunk', this.proceedChunk);
      this.addListener('createStreams', this.createStreams);

      this.addListener(
        'calculateStats',
        throttle(() => {
          const _t = this.transferTime / this.sentChunks / this.config.streams;
          this.result.estimateTime = _t * (this.fileLength - this.sentChunks);
          this.result.estimateSpeed = this.config.chunkSize / (_t / 1000);

          const progress = Math.round(
            (this.sentChunks / this.fileLength) * 100,
          );
          this.result.progress = progress;
          if (this.config.onProgress) {
            this.config.onProgress.call(this.result, progress, this.fileData);
          }
          this.result.emit('progress', progress, this.fileData);
        }, 250),
      );

      this.addListener('_onEnd', () => {
        if (this.result.estimateTimer) {
          clearInterval(this.result.estimateTimer);
        }
        if (this.beforeunload) {
          // window.removeEventListener('beforeunload', this.beforeunload, false);
        }
        if (this.result) {
          this.result.progress = 0;
          return this.result.progress;
        }
        return undefined;
      });
    } else {
      throw new Error(
        500,
        '[FilesCollection] [insert] Have you forget to pass a File itself?',
      );
    }
  }

  end(error, data) {
    this.emit('_onEnd');
    this.result.emit('uploaded', error, data);
    if (this.config.onUploaded) {
      this.config.onUploaded.call(this.result, error, data);
    }

    if (error) {
      this.result.abort();
      this.result.state = 'aborted';
      this.result.emit('error', error, this.fileData);
      if (this.config.onError) {
        this.config.onError.call(this.result, error, this.fileData);
      }
    } else {
      this.result.state = 'completed';
      // this.collection.emit('afterUpload', data);
      if (this.config.onEnd) {
        this.config.onEnd.call(this.result, this.fileData);
      }
    }
    this.result.emit('end', error, data || this.fileData);
    return this.result;
  }

  sendChunk(evt) {
    const opts = {
      fileId: this.fileId,
      binData: evt.data.bin,
      chunkId: evt.data.chunkId,
    };

    if (this.config.isBase64) {
      const pad = opts.binData.length % 4;
      if (pad) {
        let p = 0;
        while (p < pad) {
          opts.binData += '=';
          p += 1;
        }
      }
    }

    this.emit('data', evt.data.bin);
    if (this.pipes.length) {
      for (let i = this.pipes.length - 1; i >= 0; i -= 1) {
        opts.binData = this.pipes[i](opts.binData);
      }
    }

    if (this.fileLength === evt.data.chunkId) {
      this.emit('readEnd');
    }

    if (opts.binData) {
      this.config.ddp.callAsync(
        '_FilesCollectionWrite_attachments',
        opts,
        (error) => {
          this.transferTime += +new Date() - this.startTime[opts.chunkId];
          if (error) {
            if (this.result.state !== 'aborted') {
              this.emit('end', error);
            }
          } else {
            this.sentChunks += 1;
            if (this.sentChunks >= this.fileLength) {
              this.emit('sendEOF');
            } else if (this.currentChunk < this.fileLength) {
              this.emit('upload');
            }
            this.emit('calculateStats');
          }
        },
      );
    }
  }

  sendEOF() {
    if (!this.EOFsent) {
      this.EOFsent = true;
      const opts = {
        eof: true,
        fileId: this.fileId,
      };

      this.config.ddp.callAsync(
        '_FilesCollectionWrite_attachments',
        opts,
        (error, result) => {
          this.emit('end', error, result);
        },
      );
    }
  }

  proceedChunk(chunkId) {
    const chunk = this.config.file.slice(
      this.config.chunkSize * (chunkId - 1),
      this.config.chunkSize * chunkId,
    );

    if (this.config.isBase64) {
      this.emit('sendChunk', {
        data: {
          bin: chunk,
          chunkId,
        },
      });
    } else {
      let fileReader;
      if (window.FileReader) {
        fileReader = new window.FileReader();

        fileReader.onloadend = (evt) => {
          this.emit('sendChunk', {
            data: {
              bin: (
                (isObject(fileReader) ? fileReader.result : undefined) ||
                (evt.srcElement ? evt.srcElement.result : undefined) ||
                (evt.target ? evt.target.result : undefined)
              ).split(',')[1],
              chunkId,
            },
          });
        };

        fileReader.onerror = (e) => {
          this.emit('end', (e.target || e.srcElement).error);
        };

        fileReader.readAsDataURL(chunk);
      } else if (window.FileReaderSync) {
        fileReader = new window.FileReaderSync();

        this.emit('sendChunk', {
          data: {
            bin: fileReader.readAsDataURL(chunk).split(',')[1],
            chunkId,
          },
        });
      } else {
        this.emit('end', 'File API is not supported in this Browser!');
      }
    }
  }

  upload() {
    if (this.result.onPause) {
      return this;
    }

    if (this.result.state === 'aborted') {
      return this;
    }
    if (this.currentChunk < this.fileLength) {
      this.currentChunk += 1;
      this.emit('proceedChunk', this.currentChunk);
    } else {
      this.emit('sendEOF');
    }
    this.startTime[this.currentChunk] = +new Date();
    return this;
  }

  createStreams() {
    let i = 0;
    while (i <= this.config.streams) {
      this.emit('upload');
      i += 1;
    }
  }

  prepare() {
    let _len;
    if (this.config.onStart) {
      this.config.onStart.call(this.result, null, this.fileData);
    }
    this.result.emit('start', null, this.fileData);

    if (this.config.chunkSize === 'dynamic') {
      this.config.chunkSize = this.fileData.size / 1000;
      if (this.config.chunkSize < 327680) {
        this.config.chunkSize = 327680;
      } else if (this.config.chunkSize > 1048576) {
        this.config.chunkSize = 1048576;
      }

      if (isSafari) {
        this.config.chunkSize = Math.ceil(this.config.chunkSize / 8);
      }
    }

    if (this.config.isBase64) {
      this.config.chunkSize = Math.floor(this.config.chunkSize / 4) * 4;
      _len = Math.ceil(this.config.file.length / this.config.chunkSize);
    } else {
      this.config.chunkSize = Math.floor(this.config.chunkSize / 8) * 8;
      _len = Math.ceil(this.fileData.size / this.config.chunkSize);
    }

    if (this.config.streams === 'dynamic') {
      // this.config.streams = clone(_len);
      // if (this.config.streams > 24) { this.config.streams = 24; }

      // if (isSafari) {
      this.config.streams = 1;
      // }
    }

    this.fileLength = _len <= 0 ? 1 : _len;
    if (this.config.streams > this.fileLength) {
      this.config.streams = this.fileLength;
    }
    this.result.config.fileLength = this.fileLength;

    const opts = {
      file: this.fileData,
      fileId: this.fileId,
      chunkSize: this.config.isBase64
        ? (this.config.chunkSize / 4) * 3
        : this.config.chunkSize,
      fileLength: this.fileLength,
    };

    if (this.FSName !== this.fileId) {
      opts.FSName = this.FSName;
    }

    const handleStart = (error) => {
      if (error) {
        this.emit('end', error);
      } else {
        this.result.continueFunc = () => {
          this.emit('createStreams');
        };
        this.emit('createStreams');
      }
    };

    this.config.ddp.callAsync(
      '_FilesCollectionStart_attachments',
      opts,
      handleStart,
    );
  }

  pipe(func) {
    this.pipes.push(func);
    return this;
  }

  start() {
    let isUploadAllowed;
    if (this.fileData.size <= 0) {
      this.end(new Error(400, "Can't upload empty file"));
      return this.result;
    }

    if (this.config.onBeforeUpload && isFunction(this.config.onBeforeUpload)) {
      isUploadAllowed = this.config.onBeforeUpload.call(
        { ...this.result, ..._getUser() },
        this.fileData,
      );
      if (isUploadAllowed !== true) {
        return this.end(
          new Error(
            403,
            isString(isUploadAllowed)
              ? isUploadAllowed
              : 'config.onBeforeUpload() returned false',
          ),
        );
      }
    }

    this.emit('prepare');
    return this.result;
  }

  manual() {
    this.result.start = () => {
      this.emit('start');
    };

    const self = this;
    this.result.pipe = (func) => {
      self.pipe(func);
      return this;
    };
    return this.result;
  }
}
