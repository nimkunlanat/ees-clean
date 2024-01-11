﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.SU;
public class Message : EntityBase
{
    public string MessageCode { get; set; }
    public string LanguageCode { get; set; }
    public string MessageDesc { get; set; }
    public string Remark { get; set; }
}